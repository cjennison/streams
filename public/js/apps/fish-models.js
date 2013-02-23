Streams.app_control.apps.fish_models = {
  name : 'Fish Population Models',
  order: 5,
  init : function () {
    // Nothing in context yet!
    var context = { };
    var template = Handlebars.templates['fish-models'];
    var view=$('#fish-models-app');
    $(view).addClass("application");
    
    var model = $('div#fish-models-app.application .styledSelect select');

    
    var stockingslider1 = view.find('.stockingslider1');
    var stockingNumber = view.find('.stockingNumber');
    var countslider1 = view.find('.countslider1');
    var countNumber = view.find('.countNumber');
    
    var runbutton = view.find('#run');
    
    runbutton.button({disabled:false});
    
    
    countslider1.slider({
      		max    : 100,
	        min     : 0,
	        range   : 'min',
	        value   : 50,
	        animate : 'fast',
     		 disabled:false,
     		 slide   : function (event, ui) {
     		 	countNumber.text(ui.value);
     		 }
    });
    
    stockingslider1.slider({
      		max    : 100,
	        min     : 0,
	        range   : 'min',
	        value   : 50,
	        animate : 'fast',
     		 disabled:false,
     		 slide   : function (event, ui) {
     		 	stockingNumber.text(ui.value);
     		 }
    });
    
    
    
    model.change(function(){
		console.log($(this).val())
		console.log($('div#fish-models-app.application ' + '#' + $(this).val()));
		
		//console.log($('div#fish-models-app.application .app_content .app'));
		var appContent = $('div#fish-models-app.application .app_content .app');
		console.log(appContent);
		for(var i=0;i<appContent.length;i++){
			console.log(appContent[i])
			if($(appContent[i]).hasClass("app")){
				console.log("I GOT IT")
				$(appContent[i]).removeClass("active")
			}
		}
		
		$('div#fish-models-app.application ' + '#' + $(this).val()).addClass("active")
	})
    
    
    this.view = view;
    
       var that = this;

    $(runbutton).bind('click', function(){
    	that.run();
    	return false;
    });
    

  },
  
  run : function () {
  	
  	
    var model = $('div#fish-models-app.application .styledSelect select.selectRun');
    
  	//Passed Variables
  	var scriptName = $(model).val();
	var stocking_stage = $("#" + scriptName + " .stockingNumber" ).html();
	var stocking_count = $("#" + scriptName + " .countNumber" ).html();	//Get Basin ID and ALIAS
  	var basin_id = Streams.app_control.apps.basin.basin.id;
  	var run_alias = $('div#fish-models-app.application .runModel .runInput').val();
  	
  	//if Basin Alias is null, create a name for them
  	if(run_alias == "" || run_alias == " Enter a run name"){
  		run_alias = Math.ceil(Math.random()*100000);
  	}
  	
  	//Create sending Object
  	var population = {	flag:true,
  					scriptName:scriptName,
  					basin_id:basin_id,
  					stocking_stage:stocking_stage,
  					stocking_count:stocking_count,
  					run_alias:run_alias,
  					};
  	
 	
 	var prec_ClimateInformation = Streams.app_control.apps.weather_models.getClimateInformation();
  	var prec_LandInformation = Streams.app_control.apps.land_use_models.getLandInformation();
  	var prev_FlowInformation = Streams.app_control.apps.environmental_models.getFlowInformation();
	var prev_TempInformation = Streams.app_control.apps.stream_flow_models.getStreamTempInformation();


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
			"scriptName":prev_TempInformation.scriptName,
			"alias":prev_TempInformation.run_alias,
		},
		
		"population": {
			"step":"population",
			"scriptName":population.scriptName,
			"alias":population.run_alias,
			"stocking_count":population.stocking_count,
			"stocking_stage":population.stocking_stage,
		}
		
		}});
		
		Status.addQueue(population);
	
		
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
  		
  	
  	
  	console.log("RUNNING LAND USE MODEL")
  	enableButton("inputButton");
  	enableButton("outputButton");
  	enableButton("graphButton");
  },
};
