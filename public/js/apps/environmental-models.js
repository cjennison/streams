Streams.app_control.apps.environmental_models = {
  name : 'Environmental and Streamflow Models',
  order: 3,
  init : function () {
    //// Initialize View ////
    // Nothing in context yet!
    var context = { };
    var template = Handlebars.templates['environmental-models'];
    var view=$(template(context));
    
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
