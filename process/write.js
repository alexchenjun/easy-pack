/**
 * 文件写入
 */
const fs = require('fs');
const path = require('path');
const merge = require('webpack-merge');
const Util = require('./utils.js');
const { TYPES } = require('./reducer.js');
const beautify = require('js-beautify').js_beautify;

const handleData = (mergeFile, Vars, Configs) => {
    const webPackConfigStr = JSON.stringify(Configs, Util.newReplace, 4);
    const webPackConfigStrWrap = `module.exports = ` + webPackConfigStr;

    let webPackVarStr = "";
    const webPackVarKeys = Object.keys(Vars);
    webPackVarKeys.map( (wKey, wIndex) => {
        webPackVarStr = webPackVarStr +`const ${wKey} = "${Vars[wKey]}";\n`
    })

    const webPackConcat = webPackVarStr + '\n' + webPackConfigStrWrap;
    
    fs.writeFileSync(mergeFile, webPackConcat, 'utf-8');
    const mergeData = fs.readFileSync(mergeFile, "utf-8")
            .replace(/"@(\/\\)(\\)(\S*)"/g, "$1$3")
            .replace(/\\\?/g,"\?") // 处理字体双斜杠/\.(eot|ttf|woff|woff2|svg|svgz)(\\?.+)?$/
            .replace(/"@(\/\S*)"/g, "$1")     // 处理"@/node_modules/"
            .replace(/"<%/g, '')
            .replace(/%>"/g, '');
    const beautifyData = beautify(mergeData, { indent_size: 4 });
    fs.writeFileSync(mergeFile, beautifyData, 'utf-8');
}

const writeFile = (state , ProjectPath, dispatch) => {
    const {Packages, Vars, Configs, VarsProd, ConfigsProd} = state;

    /**
     * 写入package.json
     */
    const mergeJsonFile = path.resolve(ProjectPath, './package.json');
    const JSONStr = JSON.stringify(Packages, null, 4);
    fs.writeFileSync(mergeJsonFile, JSONStr, 'utf-8');


    /**
     * 写入webpack.config.js文件
     */
    const mergeFile = path.resolve(ProjectPath, './config/webpack.config.js');
    handleData(mergeFile, Vars, Configs);


    /**
     * 写入webpack.prod.js文件
     */
    const mergeProdFile = path.resolve(ProjectPath, './config/webpack.prod.js');
    handleData(mergeProdFile, VarsProd, ConfigsProd);

    
    dispatch({
        type: TYPES.update,
        payload: {
            Packages: {},
            Vars: {},
            Configs: {},
            VarsProd: {},
            ConfigsProd: {}
        }
    })

    return true;
}

module.exports = writeFile;