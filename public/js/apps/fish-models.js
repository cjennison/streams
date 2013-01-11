Streams.app_control.apps.fish_models = {
  name : 'Fish Population Models',
  order: 5,
  init : function () {
    // Nothing in context yet!
    var context = { };
    var template = Handlebars.templates['fish-models'];
    var view=$('#fish-models-app');
    $(view).addClass("application");
    
    
    var nullslider2 = view.find('.nullslider2');
    var nullbutton = view.find('.nullbutton');
    
    nullbutton.button({disabled:true});
    nullslider2.slider({
      value:1,
      min:0,
      max:1,
      step:0.1,
      disabled:true
    });
    
    this.view = view;

  }
};
