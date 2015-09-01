/*
Note: Don't put quotation marks in the command, otherwise will go to nodejs shell command
check input arguments number. should be 7
node src_code/main.js McGurk Clear ./src_data/McGurkClearScript.zil Noise ./src_data/McGurkNoiseScript.zil ./src_data/McGurkKey.xlsx
node src_code/main.js N-NN  Native ./src_data/Ella_NNN-N1.azk NonNative ./src_data/Ella_NNN-NN1.azk ./src_data/N-NNKey.xlsx
  0          1         2      3              4                 5                     6                         7
*/

//step 0: validate user input
var fs = require('fs');
var _ = require('underscore');

function errorExit(errStr) {
  console.log(errStr);
  process.exit(0);
}

if (process.argv.length !== 8) {
  errorExit('Input arguments are wrong. Should look like ' +
    'node src_code/main.js McGurk Clear ./src_data/McGurkClearScript.zil Noise ./src_data/McGurkNoiseScript.zil ./src_data/McGurkKey.xlsx');
}

var expType = process.argv[2];
var dmdxFileType1 = process.argv[3];
var dmdxFile1 = process.argv[4];
var dmdxFileType2 = process.argv[5];
var dmdxFile2 = process.argv[6];
var keyFile = process.argv[7];

function checkInputFile(fileType, expectFileType, errInfo, dmdxFile, expectFileExt) {
  if (fileType !== expectFileType) {
    errorExit(errInfo + expectFileType);
  } else {
    if (dmdxFile.substr(-4) !== expectFileExt) {
      errorExit('The dmdx file extension should be ' + expectFileExt);
    }
  }
}
//check argument spelling and file extensions
switch (expType) {
  case 'McGurk':
    checkInputFile(dmdxFileType1, 'Clear', 'The fourth argument should be ', dmdxFile1, '.zil');
    checkInputFile(dmdxFileType2, 'Noise', 'The sixth argument should be ', dmdxFile2, '.zil');
    break;
  case 'N-NN':
    checkInputFile(dmdxFileType1, 'Native', 'The fourth argument should be ', dmdxFile1, '.azk');
    checkInputFile(dmdxFileType2, 'NonNative', 'The sixth argument should be ', dmdxFile2, '.azk');
    break;
  default:
    errorExit('The third argument should be "N-NN" or "McGurk"');
}

//check file existense
_.each([dmdxFile1, dmdxFile2, keyFile], function(f) {
  if (!fs.existsSync(f)) {
    errorExit('Could not find the file at: ' + f);
  }
});


//step 1: load dmdx
var dmdxToJsonArr = require('./dmdxToJsonArr');
var dmdxJsonArr1 = dmdxToJsonArr.load(expType, dmdxFile1, dmdxFileType1);
var dmdxJsonArr2 = dmdxToJsonArr.load(expType, dmdxFile2, dmdxFileType2);

var dmdxJsonArr = dmdxJsonArr1.concat(dmdxJsonArr2);
var groups = _.groupBy(dmdxJsonArr, 'ID');


//step 2: load the keys and merge them with item json;
var keyToJson = require('./loadKey');
keyToJson.loadFile(keyFile);
var itemKey = require('./mergeItemKey');

var jsonArr = [];
_.each(groups, function(g) {
  _.each(g, function(itemJson) {
    var sheetType = '';
    if (itemJson.hasOwnProperty('Genre')) {
      sheetType = 'Genre';
    } else {
      sheetType = 'Condition';
    }
    var keyJson = keyToJson.getJsonByItemNo(itemJson[sheetType], itemJson['Item number']);
    jsonArr.push(itemKey.merge(itemJson, keyJson, expType));
  });
});


//step 3: write the json arr to a csv file
var writeJson2csv = require('./jsonToCsv').jsonArrToCsv;
writeJson2csv(jsonArr, expType);
