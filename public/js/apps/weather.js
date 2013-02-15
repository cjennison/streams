/** The Weather App.
 */
Streams.app_control.apps.weather_models = {
  name : 'Weather and Climate Models',
  order: 2,
  
  
	getRuns: function(){
		var runs = $.get('/users/' + Streams.user + '/runs');
		var check = setInterval(function(){
			console.log(runs);
			if(runs.readyState == 4){
				clearInterval(check);
				console.log(runs);
				return runs;
			}
		}, 2000)
		return null;
	},
	
	
  /**
   *Starts the Weather Model View 
   */
  init : function () {
  	
   
    var view              = $('#weather-models-app');
    $(view).addClass("application");
    
    var precipSlider1Val  = view.find('#precip01-value');
    var precipSlider2Val  = view.find('#precip02-value');
    var graph1			  = view.find('#graphcontainer1');
    var graph2			  = view.find('#graphcontainer2');
    var meanTempChange    = view.find('#mean-temp');
    var meanTempChangeVal = view.find('#mean-temp-value');
    var runButton         = view.find('#run');

    // The message element to display information:
    var msg               = view.find('#message');
    var model = $('div#weather-models-app.application .styledSelect select');
	//var runData = Streams.app_control.apps.weather_models.getRuns();
	

	
	
    // Set initial values for the sliders.
    precipSlider1Val.text(1);
    precipSlider2Val.text(1);
    meanTempChangeVal.text(0);
    //weathermodels
    this.setupGraph('graphcontainer1', 'mean_var', -5, 5, "Time", "Percent Change");
    this.setupGraph('graphcontainer2', 'temp', -15, 15, "Time", "Annual Temp");
    
    //basinemodels
    this.setupGraph('baselineHistoric_graphcontainer1', 'base_mean_var', -5, 5, "Time", "Percent Change");
    this.setupGraph('baselineHistoric_graphcontainer2', 'base_temp', -15, 15, "Time", "Annual Temp");
    
    
	model.change(function(){
		console.log($(this).val())
		console.log($('div#weather-models-app.application ' + '#' + $(this).val()));
		
		console.log($('div#weather-models-app.application .app_content .app'));
		var appContent = $('div#weather-models-app.application .app_content .app');
		for(var i=0;i<appContent.length;i++){
			if($(appContent[i]).hasClass("active")){
				$(appContent[i]).removeClass("active")
			}
		}
		
		$('div#weather-models-app.application ' + '#' + $(this).val()).addClass("active")
	})
	
	
	

    // Save the context of this object:
    var that = this;

    // This function checks the status of the Rscript model. It
    // communicates with the server using Ajax to determine if
    // there is any output to be displayed in the UI or if the
    // image files are available for display.
    function statusCheck () {
      console.log('statusCheck called');
      $.get('/mexec/status', function (data) {
        var entry = data;

        console.log(JSON.stringify(entry));

        if (entry.type === 'empty') {
          // Do nothing.
          setTimeout(statusCheck, 1000);
        }
        
        if (entry.type === 'complete') {
          msg.text('done.');
          msg.fadeOut('slow');
          runButton.button('option', 'disabled', false);
        }
        
        if (entry.type === 'info') {
          msg.html('<img src="images/ajax-loader.gif"/>');
          msg.append(entry.message);
          setTimeout(statusCheck, 1000);
        }

        if (entry.type === 'image') {
          console.log(entry.url);
          Streams.ui.makeImageBox({ title : entry.url, url : entry.url });
          setTimeout(statusCheck, 10);
        }
      });
    }
    
    runButton.button();
    runButton.click(function (event) {
    	console.log("RUN")
      	//runButton.button('option', 'disabled', true);
      	that.run();
      	setTimeout(statusCheck, 3000);
     	return false;
    });
  
    this.view = view;
  },

  run : function () {
  	
  	var model = $('div#weather-models-app.application .styledSelect select');
  	
  	//Passed Variables
  	var scriptName = $(model).val();
  	var precip_mean_y1 = $('#mean_1').val();
  	var precip_mean_yn = $('#mean_2').val();
  	var precip_var_y1 = $('#precip02-value').val();
  	var temp_mean_y1 = $('#mean_temp_1').val();
  	var temp_mean_yn = $('#mean_temp_2').val();
  	var n_years = Streams.yearRange || 30;
  	var basin_id = Streams.app_control.apps.basin.basin.id;
  	var run_alias = $('div#weather-models-app.application .runModel .runInput').val();
  	
  	if(run_alias == "" || run_alias == " Enter a run name"){
  		run_alias = Math.ceil(Math.random()*100000);
  	}
  	
  	console.log(run_alias);
  	
  	var climate = {	flag:true,
  					scriptName:scriptName,
  					basin_id:basin_id,
  					precip_mean_y1:precip_mean_y1,
  					precip_mean_yn:precip_mean_yn,
  					precip_var_y1:precip_var_y1,
  					precip_var_yn:precip_var_y1,
  					temp_mean_y1:temp_mean_y1,
  					temp_mean_yn:temp_mean_yn,
  					n_years:n_years,
  					run_alias:run_alias};

	console.log("I am sending the Climate Object");
	console.log(climate);  	
  	
	var serverResponse = $.post('/mexec', {"webInfo": {
		"climate": {
			"step": "climate",
			"flag": climate.flag,
			"alias": climate.run_alias,
			"scriptName": climate.scriptName,
			"basin_id": climate.basin_id,
			"preceding": {

			},
			"precip_mean_y1": climate.precip_mean_y1,
			"precip_mean_yn": climate.precip_mean_yn,
			"precip_var_y1": climate.precip_var_y1,
			"precip_var_yn": climate.precip_var_yn,
			"temp_mean_y1": climate.temp_mean_y1,
			"temp_mean_yn": climate.temp_mean_yn,
			"n_years": climate.n_years,
	
			"wet_threshold":0
		},
		}});
		
		Status.addQueue(climate);
	
		
		var checkRespo = setTimeout(function(){
			if(serverResponse.readyState == 4){
				console.log(serverResponse)
				clearInterval(checkRespo);
				var output = Output.runInformation.parseResponse(serverResponse.responseText);
				console.log(output)
				
				var runStatus = $.post('/mexec/status', {"runID":output.runID});
				
				Status.runningProcesses.push(runStatus);
				/*
				Streams.app_control.addThumbnail(output[0].runID);
				Streams.app_control.apps.weather_models.getResults(output);				
				Status.clearQueueObject(output[0].alias);
				*/
			}
		},1000)
  		
  	
  	
  	enableButton("inputButton");
  	enableButton("outputButton");
  	enableButton("graphButton");
  	
  
    
  },
  
  getResults:function(output){
  	
  },
  
  getStatus:function(){
  	//console.log(statusObject);
  	//console.log(Status.runningProcesses);
  	for (var i = 0;i < Status.runningProcesses.length;i++){
  		//console.log(Status.runningProcesses[i].responseText);
  		var output = Output.runInformation.parseResponse(Status.runningProcesses[i].responseText);
  		var obj = Output.runInformation.parseResponse(output);
  		console.log(output);
  		console.log(obj);
  	}
  	
  	
  	
  	//console.log(output);
  },
  

  
  /**
   * 
   * @param {Object} obj
   * @param {Object} num
   */
  updateText:function(obj, num){
  	 $(obj).val(num);
  },
  
  /**
   * Sets up a Graph
 * @param {Object} container ID of the object being instantiated with the graph
 * @param {Object} state Type of graph to track
 * @param {Object} min Min Data Amount
 * @param {Object} max Max Data Amount
 * @param {Object} xLabel X Axis Label
 * @param {Object} yLabel Y Axis Label
   */
  setupGraph : function(container, state, min, max, xLabel, yLabel){
  	Streams.graphs.init(container, state, min, max, xLabel, yLabel);
  }
  
};
