Streams.app_control.apps.land_use_models = {
  name : 'Land Use Models',
  order: 4,
  init : function () {
    //// Initialize View ////
    // Nothing in context yet!
    var view=$('#land-use-models-app');
    $(view).addClass("application");
    
    var model = $('div#land-use-models-app.application .styledSelect select');

    
    var riparianslider1 = view.find('.riparianslider1');
    var surfaceslider1 = view.find('.surfaceslider1');
    
    var riparianNumber = view.find('.riparianNumber');
    var surfaceNumber = view.find('.surfaceNumber');
    
	var runButton         = view.find('#run');    
    runButton.button({disabled:false});
    riparianslider1.slider({
     		max    : 100,
	        min     : 0,
	        range   : 'min',
	        value   : 50,
	        animate : 'fast',
      		disabled:false,
      		slide   : function (event, ui) {
      			riparianNumber.text(ui.value);
      		}
    });
    
    surfaceslider1.slider({
     		max    : 100,
	        min     : 0,
	        range   : 'min',
	        value   : 50,
	        animate : 'fast',
     		 disabled:false,
     		 slide   : function (event, ui) {
     		 	surfaceNumber.text(ui.value);
     		 }
    });
    
    this.view = view;
    //var view = $('<div id="land-use-models-app">');
    //view.html('land use models app.');
    
    
    
    
    
    model.change(function(){
		console.log($(this).val())
		console.log($('div#land-use-models-app.application ' + '#' + $(this).val()));
		
		console.log($('div#land-use-models-app.application .app_content .app'));
		var appContent = $('div#land-use-models-app.application .app_content .app');
		for(var i=0;i<appContent.length;i++){
			if($(appContent[i]).hasClass("active")){
				$(appContent[i]).removeClass("active")
			}
		}
		
		$('div#land-use-models-app.application ' + '#' + $(this).val()).addClass("active")
	})
    
    
  
  }
};
