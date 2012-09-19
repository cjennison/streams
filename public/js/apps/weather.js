/** The Weather App.
 */
Streams.app_control.apps.weather_models = {
  name : 'Weather and Climate Models',
  order: 2,
  init : function () {
    //// Grab the app view ////
    var template       = Handlebars.templates.weather;

    // Nothing in context yet!
    var context = { };

    //// Initialize View ////
    var view              = $(template(context));
    var precipSlider1     = view.find('#precip01');
    var precipSlider1Val  = view.find('#precip01-value');
    var precipSlider2     = view.find('#precip02');
    var precipSlider2Val  = view.find('#precip02-value');
    var meanTempChange    = view.find('#mean-temp');
    var meanTempChangeVal = view.find('#mean-temp-value');
    var runButton         = view.find('#run');

    // The message element to display information:
    var msg               = view.find('#message');

    // Set initial values for the sliders.
    precipSlider1Val.text(1);
    precipSlider2Val.text(1);
    meanTempChangeVal.text(0);

    precipSlider1.slider(
      { max     : 50,
        min     : -50,
        range   : 'min',
        value   : 1,
        animate : 'fast',
        slide   : function (event, ui) {
          precipSlider1Val.text(ui.value);
        }
      }
    );
    
    precipSlider2.slider(
      { max     : 50,
        min     : -50,
        range   : 'min',
        value   : 1,
        animate : 'fast',
        slide   : function (event, ui) {
          precipSlider2Val.text(ui.value);
        }
      }
    );

    meanTempChange.slider(
      { max     : 7,
        min     : 0,
        range   : 'min',
        value   : 0,
        step: 0.25,
        animate : 'fast',
        slide   : function (event, ui) {
          meanTempChangeVal.text(ui.value);
        }
      }
    );

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
  }
};
