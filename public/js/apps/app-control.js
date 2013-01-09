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
  
  

  render : function () {
  	
  	/*
    // Create the accordion:
    var accordion = $('<div>');
    
    
    
    
    // Create an array of the apps:
    var apps = [];
    for (var name in this.apps) {
    	//console.log(this.apps[name])
    	if(this.apps[name].name != "Basin Selection"){
	      apps.push(this.apps[name]);
     }
    }

    // Sort the apps by order property:
    apps.sort(function (x, y) {
      return x.order > y.order;
    });

    // Add the registered apps:
    console.log('Loading Apps:');
    for (var i = 0; i < apps.length; i++) {
      var app = apps[i];
      
      console.log('    ' + app.name);
      // Initialize the app:
      app.init();
      // Add to the app control view:
      var header  = $('<h3><a href="#">' + app.name + '</a></h3>');
      accordion.append(header);
      accordion.append(app.view);
    }
    
    // Append the accordion:
    this.view.append(accordion);
    
    
    // Append to the body element:
    $('body').append(this.view);
    // Make the element resiable and draggable:
    //Streams.app_control.view.draggable();

    // Accordion options:
    var accordionOpts = {
      header    : 'h3',
      animated	: 'slide',
      heightStyle : 'content',
      fillSpace : true
    };

    // Apply some jQuery UI properties:
    
    accordion.accordion(accordionOpts);
    */
    
    this.initBasinSelection();
    
    //Comment out if testing apps - TODO : Not Operational
    this.createFakeAccordion();
  },
  
  createFakeAccordion: function(){
  	
  	//Create Container
  	var steps = $('<div id="stepsSelection">');
  	$(steps).addClass('steps-control');
  	//Create According
  	var stepsAccordion = $('<ul class="stepsSelector">');
  	$(steps).append(stepsAccordion);
  	
  	 var apps = [];
    for (var name in this.apps) {
    	//console.log(this.apps[name])
    	if(this.apps[name].name != "Basin Selection"){
	      apps.push(this.apps[name]);
     }
    }

    // Sort the apps by order property:
    apps.sort(function (x, y) {
      return x.order > y.order;
    });

    // Add the registered apps:
    console.log('Loading Apps:');
    for (var i = 0; i < apps.length; i++) {
      var app = apps[i];
      
      console.log('    ' + app.name);
      // Initialize the app:
      app.init();
      // Add to the app control view:
      var list = $("<li>")
      var header  = $('<h3><img src="images/accordion_bar.png" class="handle3">' + app.name + '</h3>');
      stepsAccordion.append(list);
      list.append(header);
      list.append(app.view);
    }
    
  	
  	//Add Basin Container to Body  
  	$('body').append(steps);
  	
  	$(stepsAccordion).hrzAccordion({containerClass     : "container3",
			listItemClass      : "listItem3",					
			
			contentWrapper     : "contentWrapper3",
			contentInnerWrapper: "contentInnerWrapper3",
			handleClass        : "handle3",
			openOnLoad:"1",
			handleClassOver    : "handleOver3",
			fixedWidth			: "400",
			handleClassSelected: "handleSelected3"
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
