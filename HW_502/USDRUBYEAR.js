let fetch = require('node-fetch');
let convert = require('xml-js');
const fs = require('fs-extra');
//Обработка XML
function saveResult(buf, year) {
    if (Number.parseInt(year) == NaN) {
        year = (new Date()).getFullYear()
    };
    fullNameFile = Number.parseInt(year) + '_USD_Course.txt';

    fs.outputFile(fullNameFile, buf);
    console.log('Create file name: ', fullNameFile);
    return buf;
};



function xmlProcessing(xml) {
    let jsonResponse = convert.xml2js(xml, { ignoreComment: true, alwaysChildren: false, compact: true });
    const valuteArr = jsonResponse.ValCurs.Record;
    let result = '';
    for (let i = 0; i < valuteArr.length; i++) {
        i == valuteArr.length - 1 ?
            result += `USD;${valuteArr[i]._attributes.Date};${valuteArr[i].Value._text}`
            : result += `USD;${valuteArr[i]._attributes.Date};${valuteArr[i].Value._text}\n`
    }
    return result
};


function setupDate(year) {
    if (Number.parseInt(year) == NaN) {
        year = (new Date()).getFullYear()
    };
    let startYear = new Date(Number.parseInt(year), 0, 1);
    let endYear = new Date(Number.parseInt(year), 11, 31);
    return `https://cbr.ru/scripts/XML_dynamic.asp?date_req1=${startYear.toLocaleDateString().split('.').join('/')}&date_req2=${endYear.toLocaleDateString().split('.').join('/')}&VAL_NM_RQ=R01235`

}

function getUsdRUBOnYear(year = (new Date()).getFullYear()) {
    const url = setupDate(year);
    if (url) {
        fetch(url)
            .then(res => res.buffer())
            .then(res => xmlProcessing(res))
            .then(res => saveResult(res, year))
            .catch(err => console.error('\n--------------------\nНе получилось :(\n\n', err));
    }
};


// getUsdRUBOnYear('2021');
module.exports = { getUsdRUBOnYear }
