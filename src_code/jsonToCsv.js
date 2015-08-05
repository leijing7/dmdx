////////////////////////////////////////////////////////////////////////////////
/*
write json to a csv file
*/
////////////////////////////////////////////////////////////////////////////////

module.exports = (function() {

  var json2csv = require('json2csv');
  var fs = require('fs');

  //McGurk Template 15 fields
  var mcFields = ['ID', 'Group', 'Subject', 'Initials', 'Item number', 'Stimulus filename', 'Stimulus gender',
    'Condition', 'Participant response', 'Reaction time', 'Accuracy', 'Response - Auditory',
    'Response - Visual', 'Response - Fused', 'Response descriptor'
  ];

  //N-NN Template 14 fields
  var nnFields = ['ID', 'Group', 'Subject', 'Initials', 'Condition', 'Item number', 'Block', 'Trial', 'Audio stimuli',
    'Reaction time', 'Accuracy', 'Target response', 'Participant response', 'Response type'
  ];

  function jsonArrToCsv(jsonArr, type) {
    var fields = [];
    switch (type) {
      case 'McGurk':
        fields = mcFields;
        break;
      case 'N-NN':
        fields = nnFields;
        break;
      default:
        throw 'wrong field choise string. Only "McGurk" or "N-NN"';
    }

    json2csv({
      data: jsonArr,
      fields: fields
    }, function(err, csv) {
      if (err) {
        console.log('write to csv file error: ', err);
      } else {
        var outputFile = './dst_data/' + type + '_result.csv';
        fs.writeFile(outputFile, csv, function(err) {
          if (err) throw err;
          console.log('file saved');
        });
      }
    });
  }
  return {
    jsonArrToCsv: jsonArrToCsv
  };

})();
