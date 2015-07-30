/*
read dmdx file
*/

var fs = require('fs');
var _ = require('underscore');

var srcFile = 'src_data/Ella_McGurkNoiseScript_data example.txt';

//trim to get rid of the empty lines at the beginning and tail
var dataStr = fs.readFileSync(srcFile, 'utf-8').trim();

//split the all file string as separate lines
var dataLines = dataStr.split('\n');

var starLineIdx = [];
_.each(dataLines, function(line, idx){
  if(line.indexOf('*******') === 0 ){
    starLineIdx.push(idx);
  }
});
starLineIdx.push(dataLines.length); //put the last line as a end of one subject
if(starLineIdx.length === 1){
  console.log("#### Empty source file. ####");
  exit(0);
}

/*
[ 3, 180, 359, 536, 715 ]
[ [ 4, 179 ], [ 181, 358 ], [ 360, 535 ], [ 537, 714 ] ]
*/
var subjectBeginEndIdx = [];
for(var i=1; i < starLineIdx.length; i++){
  subjectBeginEndIdx.push( [starLineIdx[i-1]+1, starLineIdx[i]-1] );
}

console.log('*** star line index: ', starLineIdx);
console.log('subject idx range:', subjectBeginEndIdx);


_.each(subjectBeginEndIdx, function(subjectBE, idx) {
  var subjectTitleLine = dataLines[subjectBE[0]];
  var id = subjectTitleLine.substring( subjectTitleLine.indexOf(' ID ') + 4 );
  console.log(subjectTitleLine);
  console.log(id);
})

/*
read infor from the key files
*/

var keyFile = 'tmp/McGurkKey.xlsx';

var XLSX = require('xlsx');
var workbook = XLSX.readFile(keyFile);
var jsonDataArr = XLSX.utils.sheet_to_json(workbook.Sheets['Clear']);

_.find( jsonDataArr, function(row){
  if(row['Item No.'] === this.num){
    console.log(row);
    console.log(row['Audio component']);
    return true;
  }
}, {'num':'2'});

/*
write to a csv file
*/

var outputFile = "file.csv";

var json2csv = require('json2csv');
var fields = ['ID','Group','Subject','Initials','Item number','Stimulus filename','Stimulus gender',
	'Condition (AO, VO, AV_C, AV_M)','Participant response','Reaction Time','Accuracy','Response - Auditory',
  'Response - Visual','Response - Fused','Response descriptor'];

var myCars = [
  {
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
  }
];

// json2csv({ data: myCars, fields: fields }, function(err, csv) {
//   if (err) console.log(err);
//   fs.writeFile(outputFile, csv, function(err) {
//     if (err) throw err;
//     console.log('file saved');
//   });
// });
