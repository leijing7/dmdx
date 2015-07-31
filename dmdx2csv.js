//load dmdx 
var nativeFile = 'src_data/Ella_NNN-N1.azk';
var nonNativeFile = 'src_data/Ella_NNN-NN1.azk';
var clearFile = 'src_data/McGurkClearScript.zil';
var noiseFile = 'src_data/McGurkNoiseScript.zil';

var loadDmdxToJson = require('./loadDmdx').dmdxToJson;
var dmdxJson = loadDmdxToJson(nativeFile, 'Native');

//load the keys;
//nn: Native NonNative keys
//Mc: Clear and Noise
var nkeyFile = 'src_data/N-NNKey.xlsx';
var mKeyFile = 'McGurkKey.xlsx';

var loadKeyToJson = require('./loadKey').keyToJson;

var itemJson = dmdxJson[0];
var keyJson = loadKeyToJson(nkeyFile, itemJson['Condition'], itemJson['Item number']);

console.log(itemJson);
console.log(keyJson);

//merge two dmdx and keys
var _ = require('underscore');

function mergeItemKey(ij, kj) {
  var itemKeyJson = _.extend(ij, kj);
  delete itemKeyJson['Item No.'];
  delete itemKeyJson['Stimulus type'];

  var opposite = {
    'Same': 'Different',
    'Different': 'Same'
  };

  itemKeyJson['Participant response'] = itemKeyJson['Accuracy'] ? itemKeyJson['Target response'] : opposite[itemKeyJson['Target response']];

  switch (itemKeyJson['Target response'] + '-' + itemKeyJson['Participant response']) {
    case 'Same-Same':
      itemKeyJson['Response type'] = 'CR';
      break;
    case 'Same-Different':
      itemKeyJson['Response type'] = 'False+';
      break;
    case 'Different-Same':
      itemKeyJson['Response type'] = 'Miss';
      break;
    case 'Different-Different':
      itemKeyJson['Response type'] = 'Hit';
      break;
    default:
      throw('Wrong Participant response and Target response combination');
      break;
  }

  console.log(itemKeyJson);
}

mergeItemKey(itemJson, keyJson);
