/* The AppControl module
 */
Streams.app_control = {
  name : 'AppControl',
  apps : { },
  
  init : function () {
    this.view = $('<div id="app-control">');
   
  },
  
  //Init Basin Selection
  initBasinSelection: function(){
  	
  	//Create Container
  	var basin = $('<div id="basinSelection">');
  	$(basin).addClass('basinSelection-control');
  	//Create According
  	var basinAccordion = $('<ul class="basinSelector">');
  	$(basin).append(basinAccordion);
  	
  	
  	
  	var basinList = $("<div>");
  	$(basinAccordion).append(basinList);
  	
  	//Get Basin Selection Application
  	var basinApp = this.apps.basin;
  	basinApp.init();
  	
  	//Place Header on Accordion
  	var header  = $('<h3>'+ '<a href="#">' + basinApp.name + '</a></h3>');
      basinList.append(header);
      basinList.append(basinApp.view);
    
    //Add Basin Container to Body  
  	$('body').append(basin);
  	
  	var accordionOpts = {
      header    : 'h3',
      autoHeight : false,
      //fillSpace : true
    };
  	
  	
  	
  	
  	basinAccordion.accordion(accordionOpts);
  	//basinAccordion.draggable();
  	
  },
  
  
  // Starts the rendering for each accordion
  render : function () {
  	$('#steps-controls').addClass("steps");
  	this.initBasinSelection();
  	//this.initSteps();
  },
  
  
  initSteps: function(){
  	//$('#steps-controls').addClass("active");
  	for (var name in this.apps){
  		if(name != "basin"){
  			this.apps[name].init();
  			console.log(name);
  		}
  	}
  },
  
  //Disable Steps Controls
  disableSteps: function(){
  		$('#steps-controls').removeClass("active");
  		//TODO: Add Placeholder
  },
  
  //Enable Steps Controls
  enableSteps: function(){
  		$('#steps-controls').addClass("active");
  		//TODO: Remove Placeholder
  },
  
  
  /**
   *Adds a class to the selected element  
 * @param {Object} div The Element you are referencing
 * @param {Object} className The class you are adding to the element
   */
  addClass: function(div, className){
  	$(div).addClass(className);
  },
  
  /**
   *Removes class from the selected Element 
 * @param {Object} div Element to reference
 * @param {Object} className Class to remove
   */
  removeClass: function(div, className){
  	if($(div).hasClass(className)){
  		$(div).removeClass(className);
  	} else {
  		console.log(div + " does not have classname: " + className)
  	}
  }
  
};
