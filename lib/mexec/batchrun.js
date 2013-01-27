/**
 * New node file use spawn to test
 */
var fs = require('fs');
var spawn = require('child_process').spawn;

var getPath = function(user,model, runId){
	return './'+user+'/'+model+'/'+runId;
};

var runStats ={};
var buildScriptPara = function (run) {
	var paras;

	for (var prerun in run['pre_runs']) {
		path = getPath(prerun.user,prerun.scriptName,prerun.runId);
		fs.readFile(path);
	}

	if(run['input'] !== null){
		for(var p in run['para']){
			console.log(run['input']);
			if(run['input'][p] !== null)
				paras[p]=run['input'][p];
		}
	}
	return paras;
};

function mkdir_p(dirPath, mode, callback) {
	//Call the standard fs.mkdir
	require('fs').mkdir(dirPath, mode, function(error) {
		//When it fail in this way, do the custom steps
		if (error && error.errno === 34) {
			//Create all the parents recursively
			mkdir_p(require('path').dirname(dirPath), mode, callback);
			//And then the directory
			mkdir_p(dirPath, mode, callback);
		}
		//Manually run the callback since we used our own callback to do all these
		callback && callback(error);
	});
}


var getArgs = function(paras){
	var agrs=[];
	for(var p in paras){
		args.push(p);
	}
	return args;
};
/*
var outputfile = function(Rrun, data){
	path = getPath(Rrun['user'],Rrun['scriptName'],Rrun['runId']);
	
	fs.exists(path,function(exists){
      if(!exists)	{
        mkdir_p(path);
      }
    });
    var regex = /\w+/g;
	newdata = data.match(regex).toString();
	regex = /\[[^\]]+\]/g;
	newdata.replace(regex,"");
	fs.writeFile(path, newdata, function(err){
		if (err) throw err;
    console.log(Rrun['runId']+' is saved!');
	});
};
*/
var runModels = function(runs,idx,modelpath) {
	runStats = {};
	for(var i = 0;i<runs.length;i++){
		runStats[runs[i]["scriptName"]] = false;
	}
	Rrun = runs[idx];
	console.log("model path: "+modelpath);
	//set up directory for this runs
	path = getPath(Rrun['user'],Rrun['scriptName'],Rrun['runId']);
	//if(fs.exists){
		fs.exists(path,function(exists){
	      if(!exists){
			//console.log(path);
	        mkdir_p(path);
	        console.log("create dir for run: "+Rrun['scriptName']);
	      }
		});
	/*}else{
		require('path').exists(path,function(exists){
		      if(!exists){
					//console.log(path);
			        mkdir_p(path);
			      }
				});
	}*/
	
	//prepare for spawn arguments
	RArgs =[Rrun['scriptName']+'.R'];
	var paras =JSON.stringify(Rrun);
	RArgs = RArgs.concat(paras);
	spawnOpt = {
		cwd:  modelpath,
		env: process.env
	};
	var ls = spawn('Rscript',RArgs,spawnOpt);
	ls['data']=Rrun['user']+' '+Rrun['runId']+' '+Rrun['scriptName'];
	

	ls.stdout.on('data', function (data) {
		ls['data'] = data.toString();
		console.log('stdout : ' + ls['data']);
	});

	ls.stdout.on('end', function(data){
		//console.log('stdEnd : ' + ls['data']);
		
	});

	ls.stderr.on('data', function (data) {
    	console.log('stderr: ' + data);
	});

	ls.on('exit', function (code) {
    //console.log('child process exited with code ' + code);
    console.log(Rrun['runid']+' complete');
    //TODO:outputfile(Rrun,ls['data'])
    runStats[Rrun['scriptName']] = true;
    idx++;
    if(idx<runs.length){
      runModels(runs,idx,modelpath);
    }
	});
};

// basin-----------
// read basin id-alias file and retrieve the list 


exports.runModels = runModels;
exports.buildRuns = require('./buildRunModel.js').buildRuns;
exports.mkdir_p = mkdir_p;
exports.rimraf = require('./rmdirrf.js').rimraf;

