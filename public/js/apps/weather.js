Streams.app_control.apps.weather_models = {
  name : 'Weather Models',
  
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

    precipSlider1Val.text(0);
    precipSlider2Val.text(0);
    meanTempChangeVal.text(-1);

    precipSlider1.slider(
      { max     : 100,
        min     : 0,
        range   : 'min',
        value   : 0,
        animate : 'fast',
        slide   : function (event, ui) {
          precipSlider1Val.text(ui.value);
        }
      }
    );
    
    precipSlider2.slider(
      { max     : 100,
        min     : 0,
        range   : 'min',
        value   : 0,
        animate : 'fast',        
        slide   : function (event, ui) {
          precipSlider2Val.text(ui.value);
        }
      }
    );

    meanTempChange.slider(
      { max     : 6,
        min     : -1,
        range   : 'min',
        value   : -1,
        animate : 'fast',        
        slide   : function (event, ui) {
          meanTempChangeVal.text(ui.value);
        }        
      }
    );
  
    this.view = view;
  }
};
