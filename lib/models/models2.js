var config = require('../config');
var fs     = require('fs');
var mkdirp = require('mkdirp');
var uuid   = require('node-uuid');
var util   = require('util');
var spawn  = require('child_process').spawn;

// This table is used to store active runs. Each key is a run ID and
// each value is a table indicating the step and whether it is
// processing or it is complete.
var active_runs = {};

// The executeRun function will execute a run for each of the
// provided steps.
function executeRun(user, spec) {
  console.log('[executeRun] user invoked run');
  console.log('[executeRun] spec: ' + util.inspect(spec));
  var runID = prepareRunSequence(user, spec);
  console.log('[executeRun] sequence: ' + util.inspect(active_runs[runID]));
  
  return invokeSequence(runID);
}

function prepareRunSequence(user, spec) {
  // Create run sequence:
  var sequence = [];
  for (var step in spec) {
    var model = {};
    model.user     = user;
    model.step     = step;;
    model.script   = spec[step].scriptName + '.R';
    model.basinid  = spec[step].basin_id;
    model.settings = spec[step];
    model.output   = '';
    model.status   = 'WORKING';
    sequence.push(model);
  }

  // Save sequence in active runs table:
  var runID = uuid.v4();
  active_runs[runID] = {
    rid  : runID,
    user : user,
    work : sequence
  };

  // Return the run ID:
  return runID;
}

function invokeSequence(runID) {
  // Get the sequence to run:
  var sequ      = active_runs[runID];
  // Get the next model that has not been executed:
  var nextModel = findNextModel(sequ.work);
  console.log('[invokeSequence] nextModel: ' +
              util.inspect(nextModel));
  if (nextModel !== undefined) {
    // Generate the directory name for the step:
    var stepDir   = generateStepDir(sequ.user.dir, nextModel);
  
    console.log('[invokeSequence] stepDir: ' + stepDir);
    createStepDir(stepDir, function (error) {
      if (error) {
        console.log('[invokeSequence] Could not create step directory: '
                    + error);
      }
      else {
        writeSettings(stepDir, nextModel, function (error) {
          if (error) {
            console.log('[invokeSequence] Could not write settings.json:'
                        + error);
          }
          else {
            runModel(runID, nextModel, stepDir);
          }
        });
      }
    });
  }
  // Return the run ID:
  return runID;
}

function runModel(runID, nextModel, stepDir) {
  console.log('[runModel] running model step ' + nextModel.step);
  console.log('[runModel] running script ' + nextModel.script);
  var opts = {
    cwd : config.server.ModelsDir + '/r',  // run in the R models directory
    env : process.env
  };
  // rargs are the arguments to be passed to the model as json:
  var rargs = JSON.stringify({ run_dir   : stepDir,
                               basin_dir : config.server.BasinsDir,
                               data_dir  : config.server.DataDir
                             });
  // args are the arguments to the Rscript command:
  var script = config.server.ModelsDir + '/r/' + nextModel.script;
  var args   = [ script, rargs ];

  // Invoke the model:
  console.log('[runModel] invoking RScript: ' + script + ' with ' + rargs);
  var proc = spawn('Rscript', args, opts);

  proc.stdout.on('data', function (data) {
    console.log('[' + nextModel.script + '.stdout]' + data);
    nextModel.output += data;
  });

  proc.stderr.on('data', function (data) {
    console.log('[' + nextModel.script + '.stderr]' + data);
    nextModel.output += 'ERROR: ' + data;    
  });

  proc.on('exit', function (code) {
    console.log('process completed for ' + nextModel.script);
    // When we are finished we invoke the next model in the sequence:
    if (code === 0) {
      nextModel.status = 'DONE';
      invokeSequence(runID);
    }
    else {
      nextModel.status    = 'FAILED';
      nextModel.exit_code = code;
    }
  });

  console.log('[runModel] Returning');
}

function createStepDir(stepDir, cb) {
  console.log('[createStepDir] creating ' + stepDir);
  mkdirp(stepDir, cb);
}

function writeSettings(stepDir, nextModel, cb) {
  console.log('[writeSettings] writing ' + stepDir + 'settings.json');
  fs.writeFile(stepDir + 'settings.json',
               JSON.stringify(nextModel.settings) + '\n', cb);
}

function findNextModel(work) {
  // First, find the next model to run:
  var len  = work.length;
  for (var i = 0; i < len; i++) {
    var w = work[i];
    console.log('[findNextModel] w.status = ' + w.status);
    if (w.status === 'WORKING') {
      return w;
    }
  }  
  return undefined;
}

function generateStepDir(userDir, nextModel) {
  console.log('[generateStepDir] nextModel.step: ' + nextModel.step);
  console.log('[generateStepDir] userDir: ' + userDir);

  // Generate the name of the model execution directory:
  var mdir = uuid.v4();
  var sdir = userDir + '/' + nextModel.step + '/' + mdir + '/';

  // Save the URL to the model execution directory:
  //   * The URL is the username/step/uuid-dir. This directory is
  //     exported by the server as a static directory. The front-end
  //     should be able to access files contained in that directory
  //     given this URL.
  nextModel.url = nextModel.user.name + '/' + nextModel.step + '/' + mdir;
  
  return sdir;
}

//// Status Checking Code ////

function checkRunStatus(runID) {
  var work = active_runs[runID].work;
  if (work) {
    var len = work.length;
    var ret = [];
    for (var i = 0; i < len; i++) {
      var w = work[i];
      ret.push({ status  : w.status,
                 url     : w.url,
                 step    : w.step,
                 basinid : w.basinid });
    }
    return JSON.stringify({ 'status' : 'OK',
                            'run'    : ret });
  }
  else {
    return JSON.stringify({ 'status'  : 'BAD',
                            'message' : 'Unknown runID ' + runID });
  }
}

exports.executeRun     = executeRun;
exports.checkRunStatus = checkRunStatus;
