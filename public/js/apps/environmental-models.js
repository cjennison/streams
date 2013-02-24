Streams.app_control.apps.environmental_models = {
  name : 'Environmental and Streamflow Models',
  order: 3,
  previousRunData: [],
  
  getRuns: function(){
		var runs = $.post('/users/script/runs', {'scriptname': "flow"});
		var check = setInterval(function(){
			//console.log(runs);
			if(runs.readyState == 4){
				clearInterval(check);
				var parse = Output.runInformation.parseResponse(runs.responseText);
				Streams.app_control.apps.environmental_models.populateRunList(parse);
				return runs;
				
			}
		}, 2000)
		return null;
	},
	
	populateRunList:function(rundata){
		var selectorList = $("#environmental-models-app .runTypeSelect .selectRun");
		for(var i = 0;i < rundata.length;i++){
			var settings = "http://" + document.location.host + '/' + rundata[i].path + '/settings.json';
			$.getJSON(settings, function(data){
				var option = $("<option run-id=" + data.alias + ">" + data.alias + "</option>")
				$(selectorList).append(option);
			})
		}
		
		Streams.app_control.apps.environmental_models.previousRunData = rundata;
		
		
	},
  
  init : function () {
    //// Initialize View ////
 
   var view = $('#environmental-models-app');
   console.log(view);
   $(view).addClass("application");
       var runData = Streams.app_control.apps.environmental_models.getRuns();

    var runInterval = setInterval(function(){
    	
    	if(runData != null){
    		clearInterval(runInterval);
    		console.log(runData)
    	}
    }, 1000)
    
     var that = this;
    var runbutton = view.find('#run');
    
    runbutton.button();
   
    $(runbutton).bind('click', function(){
    	that.run();
    	return false;
    });
    
    
    this.view = view;

// var view = $('<div id="environmental-models-app">');
  //  view.html('environmental models app.');
  
  },
  
  
  run : function () {
  	
  	
  	var model = $('div#environment-models-app.application .styledSelect select');
  	
  	//Passed Variables
  	var scriptName = $(model).val();

	//Get Basin ID and ALIAS
  	var basin_id = Streams.app_control.apps.basin.basin.id;
  	var run_alias = $('div#environment-models-app.application .runModel .runInput').val();
  	
  	//if Basin Alias is null, create a name for them
  	if(run_alias == "" || run_alias == " Enter a run name"){
  		run_alias = Math.ceil(Math.random()*100000);
  	}
  	
  	//Create sending Object
  	var flow = {	flag:true,
  					scriptName:scriptName,
  					basin_id:basin_id,
  					run_alias:run_alias
  					};
  	
 	
 	var prec_ClimateInformation = Streams.app_control.apps.weather_models.getClimateInformation();
  	var prec_LandInformation = Streams.app_control.apps.land_use_models.getLandInformation();

  	console.log(prec_ClimateInformation);
  	
	var serverResponse = $.post('/mexec', {"webInfo": {
		"climate": {
			"step": "climate",
			"flag": prec_ClimateInformation.flag,
			"alias": prec_ClimateInformation.run_alias,
			"scriptName": prec_ClimateInformation.scriptName,
			"basin_id": prec_ClimateInformation.basin_id,
			"preceding": {

			},
			"precip_mean_y1": prec_ClimateInformation.precip_mean_y1,
			"precip_mean_yn": prec_ClimateInformation.precip_mean_yn,
			"precip_var_y1": prec_ClimateInformation.precip_var_y1,
			"precip_var_yn": prec_ClimateInformation.precip_var_yn,
			"temp_mean_y1": prec_ClimateInformation.temp_mean_y1,
			"temp_mean_yn": prec_ClimateInformation.temp_mean_yn,
			"n_years": prec_ClimateInformation.n_years,
	
			"wet_threshold":0
		},
		
		"land": {
			"step": "land",
			"scriptName":prec_LandInformation.scriptName,
			"scenario":prec_LandInformation.scenario,
			"alias":prec_LandInformation.run_alias,
		},
		
		"flow": {
			"step": "flow",
			"scriptName":flow.scriptName,
			"alias":flow.run_alias,
		}
		
		}});
		
		Status.addQueue(flow);
	
		
		var checkRespo = setTimeout(function(){
			if(serverResponse.readyState == 4){
				console.log(serverResponse)
				clearInterval(checkRespo);
				var output = Output.runInformation.parseResponse(serverResponse.responseText);
				console.log(output)
				
				var runStatus = $.post('/mexec/status', {"runID":output.runID}).done(function(data) { console.log("I FINISHED!") });
			        runStatus.runID = output.runID;
				runStatus.alias = output.alias;
				Status.runningProcesses.push(runStatus);
				/*
				Streams.app_control.addThumbnail(output[0].runID);
				Streams.app_control.apps.weather_models.getResults(output);				
				Status.clearQueueObject(output[0].alias);
				*/
				
			}
		},1000)
  		
  	
  	
  	console.log("RUNNING FLOW MODEL")
  	enableButton("inputButton");
  	enableButton("outputButton");
  	enableButton("graphButton");
  },
  
   getFlowInformation:function(){
  	var model = $('div#environment-models-app.application .styledSelect select');
  	
  	//Passed Variables
  	var scriptName = $(model).val();

	//Get Basin ID and ALIAS
  	var basin_id = Streams.app_control.apps.basin.basin.id;
  	var run_alias = $('div#environment-models-app.application .runModel .runInput').val();
  	
  	//if Basin Alias is null, create a name for them
  	if(run_alias == "" || run_alias == " Enter a run name"){
  		run_alias = Math.ceil(Math.random()*100000);
  	}
  	
  	//Create sending Object
  	var flow = {	flag:true,
  					scriptName:scriptName,
  					basin_id:basin_id,
  					run_alias:run_alias
  					};
  					
  	return flow;
  }
};
