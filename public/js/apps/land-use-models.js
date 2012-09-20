Streams.app_control.apps.land_use_models = {
  name : 'Land Use Models',
  order: 4,
  init : function () {
    //// Initialize View ////
    // Nothing in context yet!
    var context = { };
    var template = Handlebars.templates['land-use-models'];
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
    //var view = $('<div id="land-use-models-app">');
    //view.html('land use models app.');
  
  }
};
