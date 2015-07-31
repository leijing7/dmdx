////////////////////////////////////////////////////////////////////////////////
/*
load key files as json array
*/
////////////////////////////////////////////////////////////////////////////////

module.exports = (function() {

  function keyToJson(filePath, sheetName, itemNo) {
    var XLSX = require('xlsx');
    var _ = require('underscore');

    if(!isNaN(itemNo)){
      itemNo = itemNo.toString();
    }

    var config = {
      'num': itemNo
    };

    var workbook = XLSX.readFile(filePath);
    var jsonDataArr = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    //console.log(jsonDataArr);

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
