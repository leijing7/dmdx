////////////////////////////////////////////////////////////////////////////////
/*
write json to a csv file
*/
////////////////////////////////////////////////////////////////////////////////

module.exports = (function() {

  var outputFile = "dst_data/results.csv";

  var json2csv = require('json2csv');
  var fields = ['ID', 'Group', 'Subject', 'Initials', 'Item number', 'Stimulus filename', 'Stimulus gender',
    'Condition (AO, VO, AV_C, AV_M)', 'Participant response', 'Reaction Time', 'Accuracy', 'Response - Auditory',
    'Response - Visual', 'Response - Fused', 'Response descriptor'
  ];

  var myCars = [{
    "car": "Audi",
    "price": 40000,
    "color": "blue"
  }, {
    "car": "BMW no good",
    "price": 35000,
    "color": "black"
  }, {
    "car": "Porsche",
    "price": 60000,
    "color": "green"
  }];

  // json2csv({ data: myCars, fields: fields }, function(err, csv) {
  //   if (err) console.log(err);
  //   fs.writeFile(outputFile, csv, function(err) {
  //     if (err) throw err;
  //     console.log('file saved');
  //   });
  // });
  return {
    jsonToCsv: jsonToCsv
  }

})();
