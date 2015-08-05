//step 1: load dmdx
var clearFile = './src_data/McGurkClearScript.zil';
var noiseFile = './src_data/McGurkNoiseScript.zil';

var loadDmdxToJson = require('./loadDmdx').mcDmdxToJson;
var clearDmdxJson = loadDmdxToJson(clearFile, 'Clear');
var noiseDmdxJson = loadDmdxToJson(noiseFile, 'Noise');

var mcDmdxJson = clearDmdxJson.concat(noiseDmdxJson);

//step 2: load the keys and merge them with item json;
//Mc: Clear and Noise
var mcKeyFile = './src_data/McGurkKey.xlsx';

var loadKeyToJson = require('./loadKey').keyToJson;
var itemKeyMerge = require('./mergeItemKey');

var _ = require('underscore');
var mcJsonArr = [];
_.each(clearDmdxJson, function(itemJson) {
  var keyJson = loadKeyToJson(mcKeyFile, itemJson['Genre'], itemJson['Item number']);
  mcJsonArr.push( itemKeyMerge.mergeMcItemKey(itemJson, keyJson) );
  console.log(keyJson);
});
_.each(noiseDmdxJson, function(itemJson) {
  var keyJson = loadKeyToJson(mcKeyFile, itemJson['Genre'], itemJson['Item number']);
  mcJsonArr.push( itemKeyMerge.mergeMcItemKey(itemJson, keyJson) );
});

console.log(clearDmdxJson.length);
console.log(mcJsonArr.length);
process.exit(0);

//step 3: write the json arr to a csv file
var writeJson2csv = require('./jsonTocsv').jsonArrToCsv;
writeJson2csv(mcJsonArr, 'N-NN');
