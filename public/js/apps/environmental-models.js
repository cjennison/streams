Streams.app_control.apps.environmental_models = {
  name : 'Environmental and Streamflow Models',
  order: 3,
  init : function () {
    //// Initialize View ////
 
   var view = $('#environmental-models-app');
   console.log(view);
   $(view).addClass("application");
    
    var nullslider1 = view.find('.nullslider1');
    var nullbutton = view.find('.nullbutton');
    
    nullbutton.button({disabled:true});
    nullslider1.slider({
      value:0,
      min:-50,
      max:50,
      disabled:true
    });
    
    this.view = view;

// var view = $('<div id="environmental-models-app">');
  //  view.html('environmental models app.');
  
  }
};
