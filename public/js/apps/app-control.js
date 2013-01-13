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
    
    var screenWidth = document.width;
	console.log(screenWidth);
		
	this.accordionLimit = Math.floor((screenWidth / (480))) - 1;
	console.log(this.accordionLimit);
	
	$(window).resize(function(){
			var screenWidth = document.width;
			console.log("Detected Window Resize: " + screenWidth);
			
			Streams.app_control.accordionLimit = Math.floor(screenWidth / 480) - 1;
			console.log("Accordion limit is now: " + Streams.app_control.accordionLimit);
			
			var accordionsToClose = Streams.app_control.accordionsOpen - Streams.app_control.accordionLimit;
			
			//TODO: Close All Accordions in Resize
			if(accordionsToClose > 0){
				var closeableAccordions = [];
				for(var i=0; i<$('#accordion li').length; i++){
					if($('#accordion li').parent().attr("state") == "open"){
						
					}
				}
				
				console.log(closeableAccordions);
			}
		});
   
  },
  
  //Init Basin Selection
  initBasinSelection: function(){
  	
  	//Create Container
  	var basin = $('#basinSelection');
  	$(basin).addClass('basinSelection-control');
  	//Create According
  	var basinAccordion = $('.basinSelector');
  	$(basin).append(basinAccordion);
  	
  	
  	
  	
  	
  	//Get Basin Selection Application
  	var basinApp = this.apps.basin;
  	basinApp.init();
  	
  	//Place Header on Accordion
  	var header  = $('<div class="toggle">'+ '<span class="title">' + basinApp.name + '</span></div>');
      basinAccordion.append(header);
    var content  = $('<div class="content"></div>');
      content.append(basinApp.view);
       basinAccordion.append(content);
    
    //Add Basin Container to Body  
  	$('body').append(basin);
  	
  	var accordionOpts = {
      header    : 'h3',
      autoHeight : false,
      //fillSpace : true
    };
  	
  	
  	this.bindOpen(".basinSelector .toggle");
  	this.bindClose(".basinSelector .toggle");
  	
  	//basinAccordion.accordion(accordionOpts);
  	
  },
  
  
  // Starts the rendering for each accordion
  render : function () {
  	this.initBasinSelection();
  	this.initSteps();
  	
  	
  },
  
  
  initSteps: function(){
  	$('#steps-controls').addClass("steps");
  	$('#logos').css("left", "10px");
  	$('#logos').css("bottom", "100px");
  	
  	$("#user").css("left", "50px");
  	$("#user").css("bottom", "100px");
  	
  	
  	//TODO: Turn into error function
  	$('#steps-controls').bind('click', function(){
		if(!$(this).hasClass('active')){
			console.log("Please select a basin before starting steps");
			var errorMessage = $('<div class="ErrorMessage"></div');
			var message = $('<span class="eMessage">Please Select a Basin</span>');
			$(errorMessage).append(message);
			$('body').append(errorMessage);
			
			
			
			setTimeout(function(){
				$(errorMessage).css('bottom', '100px');
				//
				setTimeout(function(){
					$(errorMessage).css('bottom', '0px');
					
					$(errorMessage).remove();
				}, 2000)
			}, 100)
		} 
  	})
  	
  
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
  		$('#acc1 .toggle').unbind();
  		$('#acc2 .toggle').unbind();
  		$('#acc3 .toggle').unbind();
  		$('#acc4 .toggle').unbind();
  		
  		$('#logos').css("right", "");
		$('#logos').css("left", "10px");
		
		$('#logos ul li').css("display", "inline-block");
		
		$('#logos').css("bottom", "100px");
		$('#logos').css("top", "");
		
		$("#user").css("left", "50px");
  		$("#user").css("bottom", "100px");
  		$("#user").css("right", "");
  		$("#user").css("top", "");
  		
  		$("#user").addClass("stepsState");

  },
  
  //Enable Steps Controls
  enableSteps: function(){
  		//$('#steps-controls').addClass("active");
  		$('#steps-controls').addClass("active");
  		this.bindOpen("#acc1 .toggle");
		this.bindOpen("#acc2 .toggle");
		this.bindOpen("#acc3 .toggle");
		this.bindOpen("#acc4 .toggle");
		
		this.bindClose("#acc1 .toggle");
		this.bindClose("#acc2 .toggle");
		this.bindClose("#acc3 .toggle");
		this.bindClose("#acc4 .toggle");
		
		$('#logos ul li').css("display", "block");
		
		//TODO: Set Classes for each of these
		
		$('#logos').css("right", "50px");
		$('#logos').css("left", "");
		
		$('#logos').css("bottom", "");
		$('#logos').css("top", "0px");
		
		$("#user").css("left", "");
  		$("#user").css("bottom", "");
  		$("#user").css("right", "10px");
  		$("#user").css("top", "470px");
  		
  		$("#user").addClass("stepsState");

		
  },
  
  bindOpen: function(target){
		$(target).bind('mousedown', function(event){
			if($(target).parent().attr("state") == "closed" && Streams.app_control.accordionsOpen < Streams.app_control.accordionLimit){
				$(target).parent().css('width', "440px");
				var activate = setTimeout(function(){
					$(target).parent().attr("state", "open");
				}, 1000);
				Streams.app_control.accordionsOpen++;
			}
		});
  },
	
  bindClose: function(target){
		$(target).bind("mousedown", function(){
			if($(target).parent().attr("state") == "open" ){
				$(target).parent().css('width', "30px");
				var activate = setTimeout(function(){
					$(target).parent().attr("state", "closed");
				}, 1000);
				Streams.app_control.accordionsOpen--;
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
