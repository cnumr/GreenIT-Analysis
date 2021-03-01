const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const ProgressBar = require('progress');
const axios = require('axios')

// keep track of worst pages based on ecoIndex
function worstPagesHandler(number){
    return (obj,table) => {
        let index;
        for (index = 0; index < table.length; index++) {
            if (obj.ecoIndex < table[index].ecoIndex) break;
        }
        table.splice(index,0,obj);
        if (table.length > number) table.pop();
        return table;
    }
}

//keep track of the least followed rule based on grade
function handleWorstRule(bestPracticesTotal,number){
    let table = [];
    for (let key in bestPracticesTotal) {
        table.push({"name" : key, "total" : bestPracticesTotal[key]})
    }
    return table.sort((a,b)=> (a.total - b.total)).slice(0,number);
}

//create xlsx report for all the analysed pages and recap on the first sheet
async function create_XLSX_report(fileList,options){
    //Timeout for an analysis
    const TIMEOUT = options.timeout || "No data";
    //Concurent tab
    const MAX_TAB = options.max_tab || "No data";
    //Nb of retry before dropping analysis
    const RETRY = options.retry || "No data";
    //Path of the output file
    const OUTPUT_FILE = path.resolve(options.xlsx_output_file);
    //Nb of displayed worst pages
    const WORST_PAGES = options.worst_pages;
    //Nb of displayed worst rules
    const WORST_RULES = options.worst_rules;

    const DEVICE = options.device;

    let handleWorstPages = worstPagesHandler(WORST_PAGES);

    //initialise progress bar
    let progressBar;
    if (!options.ci){
        progressBar = new ProgressBar(' Create report        [:bar] :percent     Remaining: :etas     Time: :elapseds', {
            complete: '=',
            incomplete: ' ',
            width: 40,
            total: fileList.length+2
        });
        progressBar.tick()
    } else {
        console.log('Creating report ...');
    }
    

    let wb = new ExcelJS.Workbook();
    //Creating the recap page
    let globalSheet = wb.addWorksheet('Global Report');
    let eco = 0; //future average
    let err = [];
    let hostname;
    let worstPages = [];
    let bestPracticesTotal= {};
    //Creating one report sheet per file
    fileList.forEach((file)=>{
        const sheet_name = file.name;
        let obj = JSON.parse(fs.readFileSync(file.path).toString());
        if (!hostname) hostname = obj.url.split('/')[2]
        //console.log(sheet_name);
        //handle potential failed analyse
        obj.nb = parseInt(sheet_name);
        if (obj.success) {
            eco += obj.ecoIndex;
            handleWorstPages(obj,worstPages);
            for (let key in obj.bestPractices) {
                bestPracticesTotal[key] = bestPracticesTotal[key] || 0
                bestPracticesTotal[key] += getGradeEcoIndex(obj.bestPractices[key].complianceLevel || "A")
            }
        } else{
            err.push({"nb":obj.nb,"url":obj.url,"grade":obj.grade,"ecoIndex":obj.ecoIndex})
        }
        // Prepare data
        let sheet_data = [
            [ "URL", obj.url],
            [ "Grade", obj.grade],
            [ "EcoIndex", obj.ecoIndex],
            [ "Eau (cl)", obj.waterConsumption],
            [ "GES (gCO2e)", obj.greenhouseGasesEmission],
            [ "Taille du DOM", obj.domSize],
            [ "Taille de la page (Ko)", `${Math.round(obj.responsesSize/1000)} (${Math.round(obj.responsesSizeUncompress/1000)})`],
            [ "Nombre de requêtes", obj.nbRequest],
            [ "Nombre de plugins", obj.pluginsNumber],
            [ "Nombre de fichier CSS", obj.printStyleSheetsNumber],
            [ "Nombre de \"inline\" CSS", obj.inlineStyleSheetsNumber],
            [ "Nombre de tag src vide", obj.emptySrcTagNumber],
            [ "Nombre de \"inline\" JS", obj.inlineJsScriptsNumber],
            [ "Nombre de requêtes", obj.nbRequest],

        ];
        sheet_data.push([],["Image retaillée dans le navigateur :"])
        for (let elem in obj.imagesResizedInBrowser) {
            sheet_data.push([obj.imagesResizedInBrowser[elem].src])
        }
        sheet_data.push([],["Best practices :"])
        for (let key in obj.bestPractices) {
            sheet_data.push([key,obj.bestPractices[key].complianceLevel || 'A' ])
        }
        //Create sheet
        let sheet = wb.addWorksheet(sheet_name);
        sheet.addRows(sheet_data)
        sheet.getCell("B2").fill = {
            type: 'pattern',
            pattern:'solid',
            fgColor:{argb: getGradeColor(obj.grade) } 
        }
        if (progressBar) progressBar.tick()
    })
    //Add info the the recap sheet
    //Prepare data
    const isMobile = (await axios.get('http://ip-api.com/json/?fields=mobile')).data.mobile //get connection type
    const date = new Date();
    eco = (fileList.length-err.length != 0)? Math.round(eco / (fileList.length-err.length)) : "No data"; //Average EcoIndex
    let grade = getEcoIndexGrade(eco)
    let globalSheet_data = [
        [ "Date", `${("0" + date.getDate()).slice(-2)}/${("0" + (date.getMonth()+ 1)).slice(-2)}/${date.getFullYear()}`],
        [ "Hostname", hostname],
        [ "Plateforme", DEVICE],
        [ "Connexion", (isMobile)? "Mobile":"Filaire"],
        [ "Grade", grade],
        [ "EcoIndex", eco],
        [ "Nombre de pages", fileList.length],
        [ "Timeout", parseInt(TIMEOUT)],
        [ "Nombre d'analyses concurrentes", parseInt(MAX_TAB)],
        [ "Nombre d'essais supplémentaires en cas d'échec", parseInt(RETRY)],
        [ "Nombre d'erreurs d'analyse", err.length],
        [ "Erreurs d'analyse :"],
    ];
    err.forEach(element => {
        globalSheet_data.push([element.nb,element.url])
    });
    globalSheet_data.push([],["Pages prioritaires:"])
    worstPages.forEach((element)=>{
        globalSheet_data.push([element.nb,element.url,"Grade",element.grade,"EcoIndex",element.ecoIndex])
    })
    globalSheet_data.push([],["Règles à appliquer :"])
    handleWorstRule(bestPracticesTotal,WORST_RULES).forEach( (elem) => {
        globalSheet_data.push([elem.name])
    });
    //add data to the recap sheet
    globalSheet.addRows(globalSheet_data);
    globalSheet.getCell("B5").fill = {
        type: 'pattern',
        pattern:'solid',
        fgColor:{argb: getGradeColor(grade) } 
    }
    if (progressBar) progressBar.tick()
    //save report
    try {
        await wb.xlsx.writeFile(OUTPUT_FILE);
    } catch (error) {
        throw ` xlsx_output_file : Path "${OUTPUT_FILE}" cannot be reached.`
    }
}

//EcoIndex -> Grade
function getEcoIndexGrade(ecoIndex){
    if (ecoIndex > 75) return "A";
    if (ecoIndex > 65) return "B";
    if (ecoIndex > 50) return "C";
    if (ecoIndex > 35) return "D";
    if (ecoIndex > 20) return "E";
    if (ecoIndex > 5) return "F";
    return "G";
}

//Grade -> EcoIndex
function getGradeEcoIndex(grade){
    if (grade == "A") return 75;
    if (grade == "B") return 65;
    if (grade == "C") return 50;
    if (grade == "D") return 35;
    if (grade == "E") return 20;
    if (grade == "F") return 5;
    return 0;
}

// Get color code by grade
function getGradeColor(grade){
    if (grade == "A") return "ff009b4f";
    if (grade == "B") return "ff30b857";
    if (grade == "C") return "ffcbda4b";
    if (grade == "D") return "fffbe949";
    if (grade == "E") return "ffffca3e";
    if (grade == "F") return "ffff9349";
    return "fffe002c";
}

module.exports = {
    create_XLSX_report
}