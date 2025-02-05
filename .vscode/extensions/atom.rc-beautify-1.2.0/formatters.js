/*
format
*/

const vscode = require('vscode');
const fs = require('fs');
const prettydiff = require('prettydiff');

const languageOptions = {
    javascript: {
        lang: "javascript"
    },
    javascriptreact: {
        lang: "jsx",
        jsx: true
    },
    typescript: {
        lang: "typescript",
        typescript: true
    },
    typescriptreact: {
        lang: "jsx",
        typescript: true,
        jsx: true
    }
};

function readConfig() {
    let config = vscode.workspace.getConfiguration('rc.beautify');
    if (typeof config === 'undefined') {
        config = {};
    }
    return config;
}

function prettydiffFactory(txt, langId) {
    let output = Object.assign({}, readConfig() , {
        source: txt,
        mode: 'beautify'
    }, languageOptions[langId]);
    return prettydiff.api(output)[0];
}


function format(txt, langId) {
    return prettydiffFactory(txt, langId);
}

/*
 // 擴展函數
*/

function allOf(doc) {
    return doc.validateRange(new vscode.Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE));
}

exports.format = format;
exports.allOf = allOf;