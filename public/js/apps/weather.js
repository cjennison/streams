/** The Weather App.
 */
Streams.app_control.apps.weather_models = {
  name : 'Weather and Climate Models',
  order: 2,
  
  

  
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

    // Set initial values for the sliders.
    precipSlider1Val.text(1);
    precipSlider2Val.text(1);
    meanTempChangeVal.text(0);
    this.setupGraph('graphcontainer1', 'mean_var');
    this.setupGraph('graphcontainer2', 'temp');
    
    

   
    
    
    
   

   

    // Save the context of this object:
    var that = this;

    // This function checks the status of the Rscript model. It
    // communicates with the server using Ajax to determine if
    // there is any output to be displayed in the UI or if the
    // image files are available for display.
    function statusCheck () {
      console.log('statusCheck called');
      $.get('/weather-model-exec/status', function (data) {
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
      runButton.button('option', 'disabled', true);
      that.run();
      setTimeout(statusCheck, 3000);
      return false;
    });
  
    this.view = view;
  },

  run : function () {
    var view  = this.view;
    var prec1 = view.find('#precip01-value').text();
    var prec2 = view.find('#precip02-value').text();
    var tempc = view.find('#mean-temp-value').text();
    var msg   = view.find('#message');

    var url = '/weather-model-exec';
    var qry = '?prec1=' + prec1 + '&' +
              'prec2=' + prec2 + '&' +
              'tempc=' + tempc;

    msg.empty();
    msg.show();
    
    $.get(url + qry, function (data) {
      if (data.status === 0) {
        msg.html('<img src="images/ajax-loader.gif"/>');
        msg.append('Running weather model...');
      }
      else {
        msg.text(data.message);
        setTimeout(function () {
          msg.fadeOut();
        }, 5000);
      }
    });
    
  },
  
  updateText:function(obj, num){
  	console.log(obj);
  	 $(obj).text(num);
  },
  
  setupGraph : function(container, state){
  	console.log(state);
  	Streams.graphs.init(container, state);
  }
  
};
