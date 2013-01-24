Streams.app_control.apps.stream_flow_models = {
	name : 'Stream Flow Models',
	order: 3,
	
	
	
	/**
   *Starts the Stream Temperature Model View 
   */
  init : function () {
    var view = $('#streamtemp-flow-app');
    $(view).addClass("application");
    
    var runButton = view.find('#run');
	runButton.button();
    
    console.log("WORKING")
  }
	
	
	
}
