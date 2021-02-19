const fs = require('fs');
const YAML = require('yaml');
const path = require('path');
const puppeteer = require('puppeteer');
const createJsonReports = require('../cli-core/analyis.js').createJsonReports;
const login = require('../cli-core/analyis.js').login;
const create_XLSX_report = require('../cli-core/xlsx.js').create_XLSX_report;

//launch core
async function analyse_core(options) {
    const URL_YAML_FILE = path.resolve(options.yaml_input_file);
    //Get list of url
    let urlTable;
    try {
        urlTable = YAML.parse(fs.readFileSync(URL_YAML_FILE).toString());
    } catch (error) {
        throw ` yaml_input_file : "${URL_YAML_FILE}" is not a valid YAML file.`
    }

    const browser = await puppeteer.launch({
        headless:true,
        args :[
            //"window-sized=1200,600",
            "--no-sandbox",                 // can't run inside docker without
            "--disable-setuid-sandbox"      // but security issues
        ],
        // Keep gpu horsepower in headless
        ignoreDefaultArgs:[
            '--disable-gpu'
        ]
    });
    let fileList;
    try {
        if (options.login){
            const LOGIN_YAML_FILE = path.resolve(options.login);
            let loginInfos;
            try {
                loginInfos = YAML.parse(fs.readFileSync(LOGIN_YAML_FILE).toString());
            } catch (error) {
                throw ` --login : "${LOGIN_YAML_FILE}" is not a valid YAML file.`
            }
            await login(browser, loginInfos)
        }
        fileList = await createJsonReports(browser, urlTable, options);
    } finally {
        let pages = await browser.pages();
        await Promise.all(pages.map(page =>page.close()));
        await browser.close()
    }
    await create_XLSX_report(fileList, options)
}

function analyse(options) {
    analyse_core(options).catch(e=>console.error("ERROR : \n" + e))
}

module.exports = analyse;