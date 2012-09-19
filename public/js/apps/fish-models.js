Streams.app_control.apps.fish_models = {
  name : 'Fish Population Models',
  order: 5,
  init : function () {
    
    var template = Handlebars.templates.fish-model;
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

    //// Initialize View ////
    //var view = $('<div id="fish-models-app">');
    //view.html('fish models app.');
  
    //this.view = view;
  }
};
