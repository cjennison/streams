Streams.app_control.apps.stream_flow_models = {
	name : 'Stream Flow Models',
	order: 3,
	 previousRunData: [],
	
	getRuns: function(){
		var runs = $.post('/users/script/runs', {'scriptname': "streamtemp"});
		var check = setInterval(function(){
			//console.log(runs);
			if(runs.readyState == 4){
				clearInterval(check);
				var parse = Output.runInformation.parseResponse(runs.responseText);
				Streams.app_control.apps.stream_flow_models.populateRunList(parse);
				return runs;
				
			}
		}, 2000)
		return null;
	},
	
	populateRunList:function(rundata){
		var selectorList = $("#streamtemp-flow-app .runTypeSelect .selectRun");
		if(selectorList.length == 0){
			var option = $("<option disabled='true'>No Existing Runs Found</option>")
		}
		for(var i = 0;i < rundata.length;i++){
			var settings = "http://" + document.location.host + '/' + rundata[i].path + '/settings.json';
			$.getJSON(settings, function(data){
				if(data.basin_id == Streams.app_control.apps.basin.basinId){
				var option = $("<option run-id=" + data.alias + " basin_id=" + data.basin_id + " scriptName=" + data.scriptName + ">" + data.alias + "</option>")
				$(option).rundata = data;				
				$(selectorList).append(option);
				}
			})
		}
		
		Streams.app_control.apps.stream_flow_models.previousRunData = rundata;
		selectorList.change(function(){
			if($("#streamtemp-flow-app .runTypeSelect .selectRun option:selected").html() == "Create New Run"){
				Streams.app_control.apps.stream_flow_models.enableInputs();
			} else {
				Streams.app_control.apps.stream_flow_models.editSettings($("#streamtemp-flow-app .runTypeSelect .selectRun option:selected"));
			}
		});
		
		
	},
	
	
	editSettings:function(options){
		console.log($(options).attr('scriptName'));
		
		var data = $(options).getAttributes();
		console.log(data);
		
		var model = $('div#streamtemp-flow-app.application .styledSelect select');
  	
	  	/**
	  	 * STAGE ONE
	  	 * Change Script Name and Window 
	  	 */
	  	$(model).val(data.scriptname);
	  	
	  	var appContent = $('div#streamtemp-flow-app.application .app_content .app');
		for(var i=0;i<appContent.length;i++){
			if($(appContent[i]).hasClass("active")){
				$(appContent[i]).removeClass("active")
			}
		}
		
		$('div#streamtemp-flow-app.application ' + '#' + $(model).val()).addClass("active")
	  	
	  	
	  	/**
	  	 * STAGE TWO
	  	 * Change Script Values 
	  	 */
	  	//$("div#environmental-models-app.application .app_content #emissions select").val(data.scenario);
	  
	  	
	  	//DISABLE INPUTS
  		Streams.app_control.apps.stream_flow_models.disableInputs();
  		
	},
	
	disableInputs:function(){
	  	var model = $('div#streamtemp-flow-app.application .styledSelect select');
	
	  	var view              = $('#streamtemp-flow-app');
	  	var runButton         = view.find('#run');
	
	   	runButton.button('option', 'disabled', true);
	
	  	var inputs = $('#streamtemp-flow-app input');
	  	for(var q = 0 ; q < inputs.length; q ++){
	  		$(inputs[q]).prop('disabled', true);
	  	}
	  	
	  	$(model).prop("disabled", true);
	  	var runInputs = $('#streamtemp-flow-app .runModel');
		$(runInputs).css('display', 'none');
	  },
	  
	  enableInputs:function(){
	  	var model = $('div#streamtemp-flow-app.application .styledSelect select');
	
	  	var view              = $('#streamtemp-flow-app');
	  	var runButton         = view.find('#run');
	
	   	runButton.button('option', 'disabled', false);
	
	  	var inputs = $('#streamtemp-flow-app input');
	  	for(var q = 0 ; q < inputs.length; q ++){
	  		$(inputs[q]).prop('disabled', false);
	  	}
	  	
	  	$(model).prop("disabled", false)
	  	var runInputs = $('#streamtemp-flow-app .runModel');
		$(runInputs).css('display', 'block');
	  },
	
	/**
   *Starts the Stream Temperature Model View 
   */
  init : function () {
    var view = $('#streamtemp-flow-app');
    $(view).addClass("application");
    
    var model = $('div#streamtemp-flow-app.application .styledSelect select.selectRun');
	/*
	var runData = Streams.app_control.apps.stream_flow_models.getRuns();
    var runInterval = setInterval(function(){
    	
    	if(runData != null){
    		clearInterval(runInterval);
    		console.log(runData)
    	}
    }, 1000)
    */
    
     var that = this;
    
    var runButton = view.find('#run');
	runButton.button();
	  runButton.click(function (event) {
    	console.log("RUN")
      	//runButton.button('option', 'disabled', true);
      	that.run();
      	//setTimeout(statusCheck, 3000);
     	return false;
    });
    
    console.log("WORKING")
  },
  
  run : function () {
  	
  	
    var model = $('div#streamtemp-flow-app.application .styledSelect select.selectRun');
    
  	//Passed Variables
  	var scriptName = $(model).val();


	//Get Basin ID and ALIAS
  	var basin_id = Streams.app_control.apps.basin.basin.id;
  	var run_alias = $('div#streamtemp-flow-app.application .runModel .runInput').val();
  	
  	//if Basin Alias is null, create a name for them
  	if(run_alias == "" || run_alias == " Enter a run name"){
  		run_alias = Math.ceil(Math.random()*100000);
  	}
  	
  	//Create sending Object
  	var streamtemp = {	flag:true,
  					scriptName:"StreamTemperatureModel",
  					basin_id:basin_id,
  					run_alias:run_alias
  					};
  	
 	
 	var prec_ClimateInformation = Streams.app_control.apps.weather_models.getClimateInformation();
  	var prec_LandInformation = Streams.app_control.apps.land_use_models.getLandInformation();
  	var prev_FlowInformation = Streams.app_control.apps.environmental_models.getFlowInformation();

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
			"step":"land",
			"scriptName":prec_LandInformation.scriptName,
			"scenario":prec_LandInformation.scenario,
			"alias":prec_LandInformation.run_alias,
		},
		
		"flow": {
			"step": "flow",
			"scriptName":prev_FlowInformation.scriptName,
			"alias":prev_FlowInformation.run_alias,
		},
		
		"streamtemp": {
			"step": "streamtemp",
			"scriptName":"StreamTemperatureModel",
			"alias":streamtemp.run_alias,
		}
		
		}});
		
		Status.addQueue(streamtemp);
	
		
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
  		
  	  		Streams.app_control.apps.stream_flow_models.disableInputs();

  	
  	console.log("RUNNING LAND USE MODEL")
  	enableButton("inputButton");
  	enableButton("outputButton");
  	enableButton("graphButton");
  	
  	var selectorList = $("#streamtemp-flow-app .runTypeSelect .selectRun");
	var option = $("<option run-id=" + streamtemp.run_alias + " basin_id=" + streamtemp.basin_id + " scriptName=" + streamtemp.scriptName + ">" + streamtemp.run_alias + "</option>")
					$(option).rundata = streamtemp;
					$(selectorList).append(option);
					console.log(option);
  },
	
	getStreamTempInformation:function(){
		 var model = $('div#streamtemp-flow-app.application .styledSelect select.selectRun');
    
	  	//Passed Variables
	  	var scriptName = $(model).val();
	
	
		//Get Basin ID and ALIAS
	  	var basin_id = Streams.app_control.apps.basin.basin.id;
	  	var run_alias = $('div#streamtemp-flow-app.application .runModel .runInput').val();
	  	
	  	//if Basin Alias is null, create a name for them
	  	if(run_alias == "" || run_alias == " Enter a run name"){
	  		run_alias = Math.ceil(Math.random()*100000);
	  	}
	  	
	  	//Create sending Object
	  	var streamtemp = {	flag:true,
	  					scriptName:"StreamTemperatureModel",
	  					basin_id:basin_id,
	  					run_alias:run_alias
	  					};
	  		return streamtemp;
	}
	
}
