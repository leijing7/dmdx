////////////////////////////////////////////////////////////////////////////////
/*
load key files as json array
*/
////////////////////////////////////////////////////////////////////////////////

module.exports = (function() {

//this could separate file reading from below for higher performance
  function keyToJson(filePath, sheetName, itemNo) {
    var XLSX = require('xlsx');
    var _ = require('underscore');

    if(!isNaN(itemNo)){
      itemNo = itemNo.toString();
    }

    var config = {
      'num': itemNo
    };

//this convert sheet to a json array
    var workbook = XLSX.readFile(filePath);
    var jsonDataArr = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    return _.find(jsonDataArr, function(row) {
      if (row['Item No.'] === this.num) {
        return true;
      }
    }, config);
  }

  return {
    keyToJson: keyToJson
  }

})();
