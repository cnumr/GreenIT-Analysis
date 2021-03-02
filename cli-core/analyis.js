const PuppeteerHar = require('puppeteer-har');
const fs = require('fs')
const path = require('path');
const ProgressBar = require('progress');
const sizes = require('../sizes.js');


//Path to the url file
const SUBRESULTS_DIRECTORY = path.join(__dirname,'../results');


//Analyse a webpage
async function analyseURL(browser, url, options) {
    let result = {};

    const TIMEOUT = options.timeout
    const TAB_ID = options.tabId
    const TRY_NB =  options.tryNb || 1
    const DEVICE = options.device || "desktop"

    try {
        const page = await browser.newPage();
        await page.setViewport(sizes[DEVICE]);
        //get har file
        const pptrHar = new PuppeteerHar(page);
        await pptrHar.start();
        //go to ulr
        await page.goto(url, {timeout : TIMEOUT});
        let harObj = await pptrHar.stop();
        //get ressources
        const client = await page.target().createCDPSession();
        let ressourceTree = await client.send('Page.getResourceTree');
        await client.detach()
    
        //get rid of chrome.i18n.getMessage not declared
        await page.evaluate(x=>(chrome = { "i18n" : {"getMessage" : function () {return undefined}}}));
        //add script, get run, then remove it to not interfere with the analysis
        let script = await page.addScriptTag({ path: path.join(__dirname,'../dist/bundle.js')});
        await script.evaluate(x=>(x.remove()));
        //pass node object to browser
        await page.evaluate(x=>(har = x), harObj.log);
        await page.evaluate(x=>(resources = x), ressourceTree.frameTree.resources);
    
        //launch analyse
        result = await page.evaluate(()=>(launchAnalyse()));
        page.close();
        result.success = true;
    } catch (error) {
        result.url = url;
        result.success = false;
    }
    result.tryNb = TRY_NB;
    result.tabId = TAB_ID;
    return result;
}

//handle login
async function login(browser,loginInformations) {
    //use the tab that opens with the browser
    const page = (await browser.pages())[0];
    //go to login page
    await page.goto(loginInformations.url)
    //ensure page is loaded
    await page.waitForSelector(loginInformations.loginButtonSelector);
    //complete fields
    for (let index = 0; index < loginInformations.fields.length; index++) {
        let field = loginInformations.fields[index]
        await page.type(field.selector, field.value)  
    }
    //click login button
    await page.click(loginInformations.loginButtonSelector);
    //make sure to not wait for the full authentification procedure
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
    //Device to emulate
    const DEVICE = options.device;

    //initialise progress bar
    let progressBar;
    if (!options.ci){
        progressBar = new ProgressBar(' Analysing            [:bar] :percent     Remaining: :etas     Time: :elapseds', {
            complete: '=',
            incomplete: ' ',
            width: 40,
            total: urlTable.length+2
        });
        progressBar.tick();
    } else {
        console.log("Analysing ...");
    }

    let asyncFunctions = [];
    let results;
    let resultId = 1;
    let index = 0
    let reports = [];
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
    for (let i = 0; i < MAX_TAB && index < urlTable.length; i++) {
        asyncFunctions.push(analyseURL(browser,urlTable[index],{
            device: DEVICE,
            timeout:TIMEOUT,
            tabId: i
        }));
        index++;
        //console.log(`Start of analysis #${index}/${urlTable.length}`)
    }

    while (asyncFunctions.length != 0) {
        results = await Promise.race(asyncFunctions);
        if (!results.success && results.tryNb <= RETRY) {
            asyncFunctions.splice(convert[results.tabId],1,analyseURL(browser,results.url,{
                device: DEVICE,
                timeout:TIMEOUT,
                tabId: results.tabId,
                tryNb: results.tryNb + 1
            })); // convert is NEEDED, varialbe size array
        }else{
            let filePath = path.resolve(SUBRESULTS_DIRECTORY,`${resultId}.json`)
            writeList.push(fs.promises.writeFile(filePath, JSON.stringify(results)));
            reports.push({name:`${resultId}`, path: filePath});
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
                asyncFunctions.splice(results.tabId,1,analyseURL(browser,urlTable[index],{
                    device: DEVICE,
                    timeout:TIMEOUT,
                    tabId: results.tabId
                })); // No need for convert, fixed size array
                index++;
                //console.log(`Start of analysis #${index}/${urlTable.length}`)
            }
        }
    }

    //wait for all file to be written
    await Promise.all(writeList);
    //results to xlsx file
    if (progressBar){
        progressBar.tick()
    } else {
        console.log("Analyse done");
    }
    return reports
}

module.exports = {
    createJsonReports,
    login
}