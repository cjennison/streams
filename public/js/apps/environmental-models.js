Streams.app_control.apps.environmental_models = {
  name : 'Environmental and Streamflow Models',
  order: 3,
  init : function () {
    //// Initialize View ////
 
   var view = $('#environmental-models-app');
   console.log(view);
   $(view).addClass("application");
    
    var runbutton = view.find('#run');
    
    runbutton.button();
   
    $(runbutton).bind('click', function(){
    	var ullist = $("#thumbnailList");
	  	var list = $("<li>");
	  	var thumb = $("<div class='svgDisplay' id='flowSvg'> </div>");
	  	$(list).append(thumb);
	  	$(ullist).append(list);
    });
    
    
    this.view = view;

// var view = $('<div id="environmental-models-app">');
  //  view.html('environmental models app.');
  
  }
};
