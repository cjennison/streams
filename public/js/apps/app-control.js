/* The AppControl module
 */
Streams.app_control = {
  name : 'AppControl',
  apps : { },
  accordionLimit: 4,
  accordionsOpen: 0,
  openAccordionArray: [],
  
  init : function () {
    this.view = $('<div id="app-control">');
   
  },
  
  //Init Basin Selection
  initBasinSelection: function(){
  	
  	//Create Container
  	var basin = $('#basinSelection');
  	$(basin).addClass('basinSelection-control');
  	//Create According
  	var basinAccordion = $('.basinSelector');
  	$(basin).append(basinAccordion);
  	
  	
  	
  	var basinList = $("<div>");
  	$(basinAccordion).append(basinList);
  	
  	//Get Basin Selection Application
  	var basinApp = this.apps.basin;
  	basinApp.init();
  	
  	//Place Header on Accordion
  	var header  = $('<div class="toggle">'+ '<span class="title">' + basinApp.name + '</span></div>');
      basinList.append(header);
      basinList.append(basinApp.view);
    
    //Add Basin Container to Body  
  	$('body').append(basin);
  	
  	var accordionOpts = {
      header    : 'h3',
      autoHeight : false,
      //fillSpace : true
    };
  	
  	
  	
  	
  	//basinAccordion.accordion(accordionOpts);
  	
  },
  
  
  // Starts the rendering for each accordion
  render : function () {
  	this.initBasinSelection();
  	this.initSteps();
  	
  	
  },
  
  
  initSteps: function(){
  	$('#steps-controls').addClass("active");
  	$('#steps-controls').addClass("steps");
  	for (var name in this.apps){
  		if(name != "basin"){
  			this.apps[name].init();
  			console.log(name);
  		}
  	}
  	
  	
	
  },
  
  //Disable Steps Controls
  disableSteps: function(){
  		//$('#steps-controls').removeClass("active");
  		$('#acc1 .toggle').unbind();
  		$('#acc2 .toggle').unbind();
  		$('#acc3 .toggle').unbind();
  		$('#acc4 .toggle').unbind();
  },
  
  //Enable Steps Controls
  enableSteps: function(){
  		//$('#steps-controls').addClass("active");
  		
  		this.bindOpen("#acc1 .toggle");
		this.bindOpen("#acc2 .toggle");
		this.bindOpen("#acc3 .toggle");
		this.bindOpen("#acc4 .toggle");
		
		this.bindClose("#acc1 .toggle");
		this.bindClose("#acc2 .toggle");
		this.bindClose("#acc3 .toggle");
		this.bindClose("#acc4 .toggle");
  },
  
  bindOpen: function(target){
		$(target).bind('mousedown', function(event){
			if($(target).parent().attr("state") == "closed"){
				$(target).parent().css('width', "440px");
				var activate = setTimeout(function(){
					$(target).parent().attr("state", "open");
				}, 1000);
				
				//$(target).unbind();
				//$(this).parent().bindClose(this);
				this.accordionsOpen++;
			}
				
				
		});
  },
	
  bindClose: function(target){
		$(target).bind("mousedown", function(){
			if($(target).parent().attr("state") == "open"){
				console.log("ARG")
				$(target).parent().css('width', "30px");
				var activate = setTimeout(function(){
					$(target).parent().attr("state", "closed");
				}, 1000);
				//$(target).unbind();
				//this.bindOpen(this);
				this.accordionsOpen--;
			}
		});
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
