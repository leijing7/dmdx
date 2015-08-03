//step 1: load dmdx
var nativeFile = './src_data/Ella_NNN-N1.azk';
var nonNativeFile = './src_data/Ella_NNN-NN1.azk';


var loadDmdxToJson = require('./loadDmdx').dmdxToJson;
var nativeDmdxJson = loadDmdxToJson(nativeFile, 'Native');
var nonNativeDmdxJson = loadDmdxToJson(nonNativeFile, 'NonNative');

//step 2: load the keys and merge them with item json;
//nn: Native NonNative keys
var nkeyFile = './src_data/N-NNKey.xlsx';

var loadKeyToJson = require('./loadKey').keyToJson;
var itemKey = require('./mergeItemKey');

var _ = require('underscore');
var nJsonArr = [];
_.each(nativeDmdxJson, function(itemJson) {
  var keyJson = loadKeyToJson(nkeyFile, itemJson['Condition'], itemJson['Item number']);
  nJsonArr.push( itemKey.mergeNnItemKey(itemJson, keyJson) );
})
_.each(nonNativeDmdxJson, function(itemJson) {
  var keyJson = loadKeyToJson(nkeyFile, itemJson['Condition'], itemJson['Item number']);
  nJsonArr.push( itemKey.mergeNnItemKey(itemJson, keyJson) );
})

//step 3: write the json arr to a csv file
var writeJson2csv = require('./jsonTocsv').jsonArrToCsv;
writeJson2csv(nJsonArr, 'N-NN');
