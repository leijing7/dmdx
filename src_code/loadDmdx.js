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
      if (line.indexOf('***********') === 0) {
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
    return subjectBeginEndIdxArr;
  }


  //get each item response with id info
  //condition: Native or NonNative
  function getNnItemRowArr(dataLineArr, subjectBeginEndIdxArr, condition) {
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

        row['Item number'] = line.split(/\s{1,}/)[0];
        row['Reaction time'] = line.split(/\s{1,}/)[1];
        row['Block'] = row['Item number'][0];
        row['Trial'] = row['Item number'][1];

        row['Accuracy'] = row['Reaction time'] > 0 ? 1 : 0;

        jsonRowArr.push(row);
      }
    })
    return jsonRowArr;
  }

  // public function for N-NN
  function nnDmdxToJson(filePath, condition) {
    var nLineArr = loadFileAsLineArr(filePath);
    var starIdxArr = getStarLineIndexArr(nLineArr);
    var subjectIdxRangeArr = getSubjectIdxRangeArr(nLineArr, starIdxArr);
    return getNnItemRowArr(nLineArr, subjectIdxRangeArr, condition);
  }

  //////////////////////////////////////////////////////////
  //get each item response with id info
  //condition: Clear or Noise
  //////////////////////////////////////////////////////////
  function getMcItemRowArr(dataLineArr, subjectBeginEndIdxArr, Genre) {
    var jsonRowArr = [];
    _.each(subjectBeginEndIdxArr, function(subjectBE, idx) {
      var subjectTitleLine = dataLineArr[subjectBE[0]];

      var id = subjectTitleLine.substring(subjectTitleLine.indexOf(' ID ') + 4);
      id = id.replace(/[\r]+/g, ''); //remove the last '\r' char;

      //+2 skip " Item       RT " header
      var noResponseItemNum = 9999;
      for (var i = subjectBE[0] + 2; i <= subjectBE[1]; i++) {
        var line = dataLineArr[i].trim();
        if (line.indexOf('Played') > 0 && line.indexOf('frames') > 0) {
          //get the item number
          var itemNum = dataLineArr[i + 1].split(',')[0].split(' ')[1];
          if (itemNum > 100) {
            continue; //greater than 100 means test item, not real data
          }
          //the row would go into the output excel file
          var row = {};

          row['ID'] = id;
          row['Group'] = id.split(',')[0];
          row['Subject'] = id.split(',')[1];
          row['Initials'] = id.split(',')[2];

          row['Item number'] = itemNum;
          row['Stimulus filename'] = line.split(' ').pop();
          if (row['Stimulus filename'].indexOf('mik') >= 0) {
            row['Stimulus gender'] = 'Male';
          }
          if (row['Stimulus filename'].indexOf('lor') >= 0) {
            row['Stimulus gender'] = 'Female';
          }
          if (!row['Stimulus gender']) {
            console.log(line);
            console.log("Error: Stimulus gender parse failed.");
          }

          row['Genre'] = Genre; //this will be removed in merge json

          row['Reaction time'] = dataLineArr[i + 1].split(',')[1].trim();

          //No response: will repeat, get the second same item info
          if (row['Reaction time'].indexOf('No') >= 0 && noResponseItemNum !== row['Item number']) {
            noResponseItemNum = row['Item number'];
            continue;
          }
          //response number, will be changed to Participant response code like 'Ba, Da'
          if (dataLineArr[i + 2].split(',')[1]) {
            row['Participant btn num'] = dataLineArr[i + 2].split(',')[1][1].trim();
          } else {
            row['Participant btn num'] = undefined;
          }

          row['Accuracy'] = row['Reaction time'] > 0 ? 1 : 0;

          // row['Response - Auditory']
          // row['Response - Visual']
          // row['Response - Fused']
          // row['Response descriptor']

          jsonRowArr.push(row);
        }
      }
    });
    //console.log(jsonRowArr);
    return jsonRowArr;

  }


  // public function for McGurk
  function mcDmdxToJson(filePath, Genre) {
    var nLineArr = loadFileAsLineArr(filePath);
    var starIdxArr = getStarLineIndexArr(nLineArr);
    var subjectIdxRangeArr = getSubjectIdxRangeArr(nLineArr, starIdxArr);
    //process.exit(0);
    return getMcItemRowArr(nLineArr, subjectIdxRangeArr, Genre);
  }

  return {
    nnDmdxToJson: nnDmdxToJson,
    mcDmdxToJson: mcDmdxToJson
  }

})();
