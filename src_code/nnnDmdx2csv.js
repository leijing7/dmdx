/*
To save time, input and outp files path are hard coded.
This file is for N-NN only
*/

//step 1: load dmdx to a json array
var nativeFile = './src_data/Ella_NNN-N1.azk';
var nonNativeFile = './src_data/Ella_NNN-NN1.azk';
var _ = require('underscore');

var loadDmdxToJson = require('./loadDmdx').nnnDmdxToJson;
var nativeDmdxJson = loadDmdxToJson(nativeFile, 'Native');
var nonNativeDmdxJson = loadDmdxToJson(nonNativeFile, 'NonNative');

//group is to put Native and NonNative items for the same subject together
var nnnDmdxJson = nativeDmdxJson.concat(nonNativeDmdxJson);
var groups = _.groupBy(nnnDmdxJson, 'ID');

//step 2: load the keys and merge them with item json;
//nn: Native NonNative keys
var nkeyFile = './src_data/N-NNKey.xlsx';
var keyToJson = require('./loadKey');
keyToJson.loadFile(nkeyFile);
var itemKey = require('./mergeItemKey');

var nnnJsonArr = [];
_.each(groups, function(g) {
  _.each(g, function(itemJson) {
    var keyJson = keyToJson.keyToJson(itemJson['Condition'], itemJson['Item number']);
    nnnJsonArr.push(itemKey.merge(itemJson, keyJson, 'N-NN'));
  });
});

//step 3: write the json arr to a csv file
var writeJson2csv = require('./jsonTocsv').jsonArrToCsv;
writeJson2csv(nnnJsonArr, 'N-NN');
