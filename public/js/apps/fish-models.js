Streams.app_control.apps.fish_models = {
  name : 'Fish Models',
  order: 5,
  init : function () {
    //// Initialize View ////
    var view = $('<div id="fish-models-app">');
    view.html('fish models app.');
  
    this.view = view;
  }
};
