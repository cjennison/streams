Streams.app_control.apps.stream_temp_models = {
	name : 'Stream Temperature Models',
	order: 4,
	
	
	
	/**
   *Starts the Stream Temperature Model View 
   */
  init : function () {
    var view = $('#streamtemp-models-app');
    $(view).addClass("application");
    
    var runButton = view.find('#run');
	runButton.button();
    
    console.log("WORKING")
  }
	
	
	
}
