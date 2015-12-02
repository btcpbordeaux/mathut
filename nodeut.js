//NODE UTILS

//new class called enhance, it enhances
function enhance(command, array, callback, errcallback, close) {
      
      var make = require('child_process').spawn,
        child = make(command, array);

        child.stdout.on('data', callback);
        child.stderr.on('data', errcallback);
        child.on('close', close );
}

//array constructor for mongoexport
// filePath - string, path to file
// optional arguments can be string mongoexport options that do not need an argument
// example: 'csv' --> '--csv'
// OR object with flag as key and argument as value
// example {d: 'pstat'}
// exportTo (filePath,[options,[more options,])
function exportTo (path) {
  if (!path) {console.log('Path needed. ERROR'); return;}
  var arr = ["-d", "pstat", "-c", "voters", "-o", path];
 
  for (var i = 1; i < arguments.length; i++) {
    //store the current argument as temporary memory
    var mem = arguments[i];
    !(typeof arguments[i] == 'object') ? !(arguments[i] > 1) ? arr.push('-' + arguments[i]) : arr.push('--' + arguments[i]) : (function () {
      
      var keys = Object.keys(mem);
      for (var j = 0; j < keys.length; j++) {
        !(keys[j].length > 1) ? arr.push('-' + keys[j]) : arr.push('--' + keys[j]);
        arr.push(mem[keys[j]]);
        }
      })();
  };
  console.log(arr);
  return arr;
}


function importFrom (fileType, path) {
  if (!fileType) {cosole.log('Please specify file type');return;}
  if (!path) {console.log('Path needed. ERROR')}
  
  var arr = ["-d", "pstat", "-c", "voters", "--type", fileType, "--file", path];
  if (fileType == "tsv" || fileType == "csv") {
    arr.push("--headerline");
  }

  for (var i = 1; i < arguments.length; i++) {
    //store the current argument as temporary memory
    var mem = arguments[i];
    !(typeof arguments[i] == 'object') ? !(arguments[i] > 1) ? arr.push('-' + arguments[i]) : arr.push('--' + arguments[i]) : (function () {
      
      var keys = Object.keys(mem);
      for (var j = 0; j < keys.length; j++) {
        !(keys[j].length > 1) ? arr.push('-' + keys[j]) : arr.push('--' + keys[j]);
        arr.push(mem[keys[j]]);
        }
      })();
  };

  return arr;
}

function exportToPy (path, fn) {
    if (!path) {console.log('Please select file to analyze');return;}
    if (typeof fn != "function") {console.log('Error, no callback');return;}
/*
    var arr = [];

    fn.call(this, arr);

    return arr;
 */
}

/*
var test = new enhance(
    "mongoexport",
    exportTo ("M:/AppDev/VoterData/vote.json"),
    function(data) {console.log('stdout: ' + data);},
    function(err) {console.log('stderr: ' + err);},
    function(b) {console.log('ending: ' + b);}
);
*/