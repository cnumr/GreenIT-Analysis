const PuppeteerHar = require('puppeteer-har');
const fs = require('fs')
const path = require('path');
const ProgressBar = require('progress');

//Path to the url file
const SUBRESULTS_DIRECTORY = path.resolve('results');


//Analyse a webpage
async function analyseURL(browser, url, timeout, tabId, nbTry= 0) {
    let result = {};
    try {
        const page = await browser.newPage();
        //get har file
        const pptrHar = new PuppeteerHar(page);
        await pptrHar.start();
        //go to ulr
        await page.goto(url, {timeout : timeout});
        let harObj = await pptrHar.stop();
        //get ressources
        const client = await page.target().createCDPSession();
        let ressourceTree = await client.send('Page.getResourceTree');
        await client.detach()
    
        //get rid of chrome.i18n.getMessage not declared
        await page.evaluate(x=>(chrome = { "i18n" : {"getMessage" : function () {return undefined}}}));
        //add script, get run, then remove it to not interfere with the analysis
        let script = await page.addScriptTag({ path: './dist/bundle.js'});
        await script.evaluate(x=>(x.remove()));
        //pass node object to browser
        await page.evaluate(x=>(har = x), harObj.log);
        await page.evaluate(x=>(resources = x), ressourceTree.frameTree.resources);
    
        //launch analyse
        result = await page.evaluate(()=>(launchAnalyse()));
        page.close();
        ressourceTree = null;
        result.success = true;
    } catch (error) {
        //console.log(error);
        result.url = url;
        result.success = false;
    }
    result.try = nbTry + 1;
    result.tabId = tabId;
    return result;
};

async function login(browser,loginInformations) {
    const page = (await browser.pages())[0];

    await page.goto(loginInformations.url)

    await page.waitForSelector(loginInformations.loginButtonSelector);

    for (let index = 0; index < loginInformations.fields.length; index++) {
        let field = loginInformations.fields[index]
        await page.type(field.selector, field.value)  
    }
    await page.click(loginInformations.loginButtonSelector)
    await page.waitForNavigation();
}

//Core
async function createJsonReports(browser, urlTable, options) {
    //Timeout for an analysis
    const TIMEOUT = options.timeout;
    //Concurent tab
    const MAX_TAB = options.max_tab;
    //Nb of retry before dropping analysis
    const RETRY = options.retry;

    let progressBar;
    if (!options.ci){
        progressBar = new ProgressBar(' Analysing            [:bar] :percent     Remaining: :etas     Time: :elapseds', {
            complete: '=',
            incomplete: ' ',
            width: 40,
            total: urlTable.length+1
        });
        progressBar.tick();
    } else {
        console.log("Analysing ...");
    }

    let asyncFunctions = [];
    let results;
    let resultId = 1;
    let index = 0
    let fileList = [];
    let writeList = [];

    let convert = [];

    for (let i = 0; i < MAX_TAB; i++) {
        convert[i] = i;
    }

    //create directory for subresults
    if (fs.existsSync(SUBRESULTS_DIRECTORY)){
        fs.rmdirSync(SUBRESULTS_DIRECTORY, { recursive: true });
    }
    fs.mkdirSync(SUBRESULTS_DIRECTORY);

    //Asynchronous analysis with MAX_TAB open simultaneously to json
    for (let i = 0; i < MAX_TAB && index < urlTable.length - 1; i++) {
        asyncFunctions.push(analyseURL(browser,urlTable[index],TIMEOUT,i));
        index++;
        //console.log(`Start of analysis #${index}/${urlTable.length}`)
    }
    while (asyncFunctions.length != 0) {
        results = await Promise.race(asyncFunctions);
        if (!results.success && results.try <= RETRY) {
            asyncFunctions.splice(convert[results.tabId],1,analyseURL(browser,results.url,TIMEOUT,results.tabId,results.try+1)); // convert is NEEDED, varialbe size array
        }else{
            let filePath = path.resolve(SUBRESULTS_DIRECTORY,`${resultId}.json`)
            writeList.push(fs.promises.writeFile(filePath, JSON.stringify(results)));
            fileList.push({name:`${resultId}`, path: filePath});
            //console.log(`End of an analysis (${resultId}/${urlTable.length}). Results will be saved in ${filePath}`);
            if (progressBar){
                progressBar.tick()
            } else {
                console.log(`${resultId}/${urlTable.length}`);
            }
            resultId++;
            if (index == (urlTable.length)){
                asyncFunctions.splice(convert[results.tabId],1); // convert is NEEDED, varialbe size array
                for (let i = results.tabId+1; i < convert.length; i++) {
                    convert[i] = convert[i]-1;
                }
            } else {
                asyncFunctions.splice(results.tabId,1,analyseURL(browser,urlTable[index],TIMEOUT,results.tabId)); // No need for convert, fixed size array
                index++;
                //console.log(`Start of analysis #${index}/${urlTable.length}`)
            }
        }
    }
    //close browser

    await Promise.all(writeList);
    //results to xlsx file
    return fileList
}

module.exports = {
    createJsonReports,
    login
}