////////////////////////////////////////////////////////////////////////////////
/*
load dmdx files as json array
*/
////////////////////////////////////////////////////////////////////////////////

module.exports = (function() {

  var fs = require('fs');
  var _ = require('underscore');

  //load a dmdx file as a line array
  function loadFileAsLineArr(filePath) {
    //trim is to get rid of the empty lines at the beginning and tail
    var dataStr = fs.readFileSync(filePath, 'utf-8').trim();

    //split the all file string as separate lines
    return dataStr.split('\n');
  }

  //get the separate star '********' line indices in the line array
  function getStarLineIndexArr(dataLineArr) {
    var starLineIdxArr = [];
    _.each(dataLineArr, function(line, idx) {
      if (line.indexOf('*******') === 0) {
        starLineIdxArr.push(idx);
      }
    });
    starLineIdxArr.push(dataLineArr.length); //put the last line as a end of one subject
    return starLineIdxArr;
  }

  /*
  Get each subject line range;
  star line and the end line: [ 3, 180, 359, 536, 715 ]
  then the range:[ [ 4, 179 ], [ 181, 358 ], [ 360, 535 ], [ 537, 714 ] ]
  */
  function getSubjectIdxRangeArr(dataLineArr, starLineIdxArr) {
    var subjectBeginEndIdxArr = [];
    for (var i = 1; i < starLineIdxArr.length; i++) {
      subjectBeginEndIdxArr.push([starLineIdxArr[i - 1] + 1, starLineIdxArr[i] - 1]);
    }

    // console.log('*** star line index: ', starLineIdxArr);
    // console.log('subject idx range:', subjectBeginEndIdxArr);
    return subjectBeginEndIdxArr;
  }


  //get each item response with id info
  //condition: Native or NonNative
  function getItemRowArr(dataLineArr, subjectBeginEndIdxArr, condition) {
    var jsonRowArr = [];
    _.each(subjectBeginEndIdxArr, function(subjectBE, idx) {
      var subjectTitleLine = dataLineArr[subjectBE[0]];

      var id = subjectTitleLine.substring(subjectTitleLine.indexOf(' ID ') + 4);
      id = id.replace(/[\r]+/g, ''); //remove the last '\r' char;

      //+2 skip " Item       RT " header
      for (var i = subjectBE[0] + 2; i <= subjectBE[1]; i++) {
        var line = dataLineArr[i].trim();
        if (line[0] === '!' || !line.split(/\s{2,}/)[0]) {
          continue; //skip description and '\r' line
        }

        //the row would go the output excel file
        var row = {};

        row['ID'] = id;
        row['Group'] = id.split(',')[0];
        row['Subject'] = id.split(',')[1];
        row['Initials'] = id.split(',')[2];
        row['Condition'] = condition;

        row['Item number'] = line.split(/\s{2,}/)[0];
        row['Reaction time'] = line.split(/\s{2,}/)[1];
        row['Block'] = row['Item number'][0];
        row['Trial'] = row['Item number'][1];

        row['Accuracy'] = row['Reaction time']>0 ? 1 : 0;

        jsonRowArr.push(row);
      }
    })
    //console.log(jsonRowArr);
    return jsonRowArr;
  }

  // public function
  function dmdxToJson(filePath, condition) {
    var nLineArr = loadFileAsLineArr(filePath);
    var starIdxArr = getStarLineIndexArr(nLineArr);
    var subjectIdxRangeArr = getSubjectIdxRangeArr(nLineArr, starIdxArr);
    return getItemRowArr(nLineArr, subjectIdxRangeArr, condition);
  }

  return {
    dmdxToJson: dmdxToJson
  }

})();
