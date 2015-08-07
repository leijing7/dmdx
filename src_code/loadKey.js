////////////////////////////////////////////////////////////////////////////////
/*
load key files as json array
*/
////////////////////////////////////////////////////////////////////////////////

module.exports = (function() {
  var XLSX = require('xlsx');
  var workbook;

  //this convert sheet to a json array
  function loadFile(filePath) {
    workbook = XLSX.readFile(filePath);
  }

 //check the key json for each item number
  function keyToJson(sheetName, itemNo) {
    var _ = require('underscore');

    var keyJsonArr = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    return _.find(keyJsonArr, function(row) {
      if (row['Item No.'] === itemNo) {
        return true;
      }
    });
  }

  return {
    loadFile: loadFile,
    getJsonByItemNo: keyToJson
  };

})();
