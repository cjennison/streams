var fs     = require('fs');
// This module represents runs performed by a user.

// A run directory:
function Run(user, stepname, mid) {
  this.user      = user;
  this.stepname  = stepname;
  this.mid       = mid;
  this.path  = user.name + '/' +
               stepname + '/' +
               mid;
}

Run.prototype.writeSettings = function(settings, cb) {
  var file = this.path + '/settings.json';
  fs.writeFile(file, JSON.stringify(settings), function (err) {
    if (err) {
      cb(ERRORS.SETTINGS_ERROR);
    }
    else {
      cb(undefined, this.path + '/settings.json');
    }
  });
};

// The collection of user runs:
function Runs(user) {
  this.user = user;
  this.runs = [];
}

Runs.prototype.getRuns = function (stepname, cb) {
  var that = this;
  console.log(this.user);
  // Read the list of run directories in a step:
  fs.readdir(that.user.dir, function (err, step_list) {
    if (err) {
      cb(err);
    }
    else {
      var path = that.user.dir + '/' + stepname;
      fs.readdir(path, function (err, run_list) {
	if (err) {
	  cb("Error reading directory: " + path);
	}
	else {
	  var runs = [];
	  var dlen = run_list.length;
	  for (var i = 0; i < dlen; i++) {
	    var run = new Run(that.user, stepname, run_list[i]);
	    runs.push(run);
	  }
	  cb(undefined, runs);
	}
      });
    }
  });

  //     for (var s = 0; s < step_list.length; s++) {
  //       var step = step_list[s];
  //       if (step !== 'config' && step === stepname) {
  //         // Read the list of runs directories in the step directory:
  //         fs.readdir(that.user.dir + '/' + step, function (err, run_list) {
  //           if (err) {
  //             cb(err);
  //           }
  //           else {
  //             for (var r = 0; r < run_list.length; r++) {
  //               var run = new Run(that.user, step, run_list[r]);
  //               that.runs.push(run);
  //             }
  //           }
  //         });
  //       }
  //     }
  //     cb(undefined, that.runs);
  //   }
  // });
};




//get the full setting of this run
Run.prototype.getSetting = function(){
  var setting = JSON.parse(fs.readFileSync(this.path+"/settings.json"));
  if(!setting) 
    console.log("the run["+this.stepname+" : "+
		this.id+"] has no setting yet/ or read file error");
  return setting;
};

//get the output result from r script
Run.prototype.getResult = function(){
  if(fs.exists(this.path)){
    var files = fs.readdirSync(this.path);
  //TODO:
  }else{
    console.log("Run does not exist");
    return null;
  }
  
};


// Export Runs object:
exports.Runs = Runs;
exports.Run = Run;
