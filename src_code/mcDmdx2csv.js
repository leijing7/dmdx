/*
Note: Don't put quotation marks in the command, otherwise will go to nodejs shell command
*/

var fs = require('fs');
var _ = require('underscore');

function errorExit(errStr) {
  console.log(errStr);
  process.exit(0);
}

//validate user input
//check input arguments number. should be 7
//node src_code/dmdxToCsv.js McGurk Clear ./src_data/McGurkClearScript.zil Noise ./src_data/McGurkNoiseScript.zil
//node src_code/dmdxToCsv.js N-NN  Native ./src_data/Ella_NNN-N1.azk NonNative ./src_data/Ella_NNN-NN1.azk
//  0          1              2      3              4                 5                     6
if (process.argv.length !== 7) {
  errorExit('Input arguments are wrong. Should look like ' +
    '"node src_code/dmdxToCsv.js McGurk Clear ./src_data/McGurkClearScript.zil Noise ./src_data/McGurkNoiseScript.zil"');
}

//check argument spelling and file extensions
switch (process.argv[2]) {
  case 'McGurk':
    if (process.argv[3].toLowerCase() !== 'clear') {
      errorExit('The fourth argument should be "Clear". ');
    } else {
      if (process.argv[4].substr(-4) !== '.zil') {
        errorExit('The fifth file extension should be .zil ');
      }
    }
    if (process.argv[5].toLowerCase() !== 'noise') {
      errorExit('The Sixth argument should be "Noise". ');
    } else {
      if (process.argv[6].substr(-4) !== '.zil') {
        errorExit('The Seventh file extension should be .zil ');
      }
    }
    break;
  case 'N-NN':
    if (process.argv[3].toLowerCase() !== 'native') {
      errorExit('The fourth argument should be "Native". ');
    } else {
      if (process.argv[4].substr(-4) !== '.azk') {
        errorExit('The fifth file extension should be .azk ');
      }
    }
    if (process.argv[5].toLowerCase() !== 'nonnative') {
      errorExit('The Sixth argument should be "NonNative". ');
    } else {
      if (process.argv[6].substr(-4) !== '.azk') {
        errorExit('The Seventh file extension should be .azk ');
      }
    }
    break;
  default:
    errorExit('The third argument should be "N-NN" or "McGurk"');
}

//check file existense
_.each([process.argv[1], process.argv[4], process.argv[6]], function(f) {
  if (!fs.existsSync(f)) {
    errorExit('Could not find the file at: ' + f);
  }
});
process.exit(0);
////////////////////////////////////////////////////////////////////////////////



//step 1: load dmdx
var clearFile = './src_data/McGurkClearScript.zil';
var noiseFile = './src_data/McGurkNoiseScript.zil';
var _ = require('underscore');

var loadDmdxToJson = require('./loadDmdx').mcDmdxToJson;
var clearDmdxJson = loadDmdxToJson(clearFile, 'Clear');
var noiseDmdxJson = loadDmdxToJson(noiseFile, 'Noise');

var mcDmdxJson = clearDmdxJson.concat(noiseDmdxJson);
var groups = _.groupBy(mcDmdxJson, 'ID');


//step 2: load the keys and merge them with item json;
//Mc: Clear and Noise
var mcKeyFile = './src_data/McGurkKey.xlsx';

var loadKeyToJson = require('./loadKey').keyToJson;
var itemKeyMerge = require('./mergeItemKey');

var mcJsonArr = [];
_.each(groups, function(g) {
  _.each(g, function(itemJson) {
    var keyJson = loadKeyToJson(mcKeyFile, itemJson['Genre'], itemJson['Item number']);
    mcJsonArr.push(itemKeyMerge.mergeMcItemKey(itemJson, keyJson));
  });
});


//step 3: write the json arr to a csv file
var writeJson2csv = require('./jsonTocsv').jsonArrToCsv;
writeJson2csv(mcJsonArr, 'McGurk');
