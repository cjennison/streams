Streams.app_control.apps.environmental_models = {
  name : 'Environmental and Streamflow Models',
  order: 3,
  init : function () {
    //// Initialize View ////
    var view = $('<div id="environmental-models-app">');
    view.html('environmental models app.');
  
    this.view = view;
  }
};
