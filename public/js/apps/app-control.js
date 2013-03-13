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
		
	this.accordionLimit = Math.floor((screenWidth / (400))) - 1;
	console.log(this.accordionLimit);
	
	$(window).resize(function(){
			var screenWidth = document.width;
			console.log("Detected Window Resize: " + screenWidth);
			
			Streams.app_control.accordionLimit = Math.floor(screenWidth / 440) - 1;
			console.log("Accordion limit is now: " + Streams.app_control.accordionLimit);
			console.log("Open Accordions: " + Streams.app_control.accordionsOpen)
			
			var accordionsToClose = Streams.app_control.accordionsOpen - Streams.app_control.accordionLimit;
			
			//TODO: Close All Accordions in Resize
			var accordions = $("#accordion li");
			console.log(accordions);
			if(accordionsToClose <= 0){ return; }
			for(var i = 0;i < accordions.length; i++){
				if($(accordions[i]).attr("state") == "open"){
					accordionsToClose--;
					$(accordions[i]).attr("state", "closed");
					$(accordions[i]).css('width', "30px");
					Streams.app_control.accordionsOpen--;
				}
				
				if(accordionsToClose <= 0){
					//console.log("Done!")
					return;
				}
			}
		});
		
		//Always Run Me
		var process = setInterval(function(){
					Streams.app_control.getStatus();
				}, 1000);
   
  },
  
  //Init Basin Selection
  initBasinSelection: function(){
  	
  	//Create Container
  	var basin = $('#basinSelection');
  	$(basin).addClass('basinSelection-control');
  	//Create According
  	var basinAccordion = $('.basinSelector');
  	$(basin).append(basinAccordion);
  	
  	var basinLi = $('<li></li>')
  	 basinAccordion.append(basinLi);
  	
  	
  	//Get Basin Selection Application
  	var basinApp = this.apps.basin;
  	basinApp.init();
  	
  	//Place Header on Accordion
  	var header  = $('<div class="toggle" state="open">'+ '<span class="title">' + basinApp.name + '</span></div>');
      basinLi.append(header);
    var content  = $('<div class="content" ></div>');
      content.append(basinApp.view);
       basinLi.append(content);
    
    //Add Basin Container to Body  
  	//$('body').append(basin);
  	
  	var accordionOpts = {
      header    : 'h3',
      autoHeight : false,
      //fillSpace : true
    };
  	
  	
  	//this.bindOpen(".basinSelector li .toggle");
  	//this.bindClose(".basinSelector li .toggle");
  	//this.bindBasinOpen();
  	//this.bindBasinClose();
  	//basinAccordion.accordion(accordionOpts);
  	
  },
  
  /*
  bindBasinOpen:function(){
  	$(".basinSelector li .toggle").bind("mousedown", function(){
  		if($(".basinSelector li .toggle").attr("state") == "open"){
	  		$(".basinSelector li .content").css("left","-340px");
	  		var activate = setTimeout(function(){
					$(".basinSelector li .toggle").attr("state", "closed");
			}, 400);
		}
  	});
  },
  
   bindBasinClose:function(){
  	$(".basinSelector li .toggle").bind("mousedown", function(){
  		if($(".basinSelector li .toggle").attr("state") == "closed"){
	  		$(".basinSelector li .content").css("left","-10px");
	  		var activate = setTimeout(function(){
					$(".basinSelector li .toggle").attr("state", "open");
			}, 400);
		}
  	});
  },
  */
  
  
  // Starts the rendering for each accordion
  render : function () {
  	this.initBasinSelection();
  	this.initSteps();
  	
  	
  },
  
  //Starts Step Controls
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
  	
  	console.log(this.apps);
  	for (var name in this.apps){
  		if(name != "basin"){
  			this.apps[name].init();
  			console.log(name);
  		}
  	}
  	
  	
	
  },
  
  removeLoader:function(){
  	$("#loadingWindow").remove();
  	$(".shadowBox").remove();
  },
  
  //Disable Steps Controls
  disableSteps: function(){
  		$('#steps-controls').removeClass("active");
  		for(var i=1;i<=6;i++){
  			$('#acc' + i + ' .toggle').unbind();
  		}
  		/*
  		$('#acc1 .toggle').unbind();
  		$('#acc2 .toggle').unbind();
  		$('#acc3 .toggle').unbind();
  		$('#acc4 .toggle').unbind();
  		$('#acc5 .toggle').unbind();
  		$('#acc6 .toggle').unbind();
  		*/
  		
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
  		
  		for(var i=1;i<=6;i++){
  			$('#acc' + i).css('width', "30px");
			$('#acc1'+ i).parent().attr("state", "closed");
  		}
  		
  		$("#acc5").css("display", "none")
  		$("#tree").removeClass("active");
		$('#basinSelection').css("display", "block");
		Streams.app_control.accordionsOpen = 0;

  },
  
  //Enable Steps Controls
  enableSteps: function(name){
  	
  		//Add Loading Screen
	  	var body = $("#inputWrapper");
		var loadingPrompt = $("<div id='loadingWindow'><h1>Loading Runs..</hi><br><img src='images/ajax-loader.gif'></div>")
		$(body).append("<div class='shadowBox'></div>")
		$(body).append(loadingPrompt);
		
  	
  		//$('#steps-controls').addClass("active");
  		$('#steps-controls').addClass("active");
  		for(var i=1;i<=6;i++){
  			var amt = 440;
  			if(i == 5){
  				amt = 300
  			}
  			this.bindOpen("#acc" + i + " .toggle", amt);
  			this.bindClose("#acc" + i + " .toggle");
  			this.bindCloseIcon("#acc" + i + " .custom-ui-icon");
  		}
  		/*
  		this.bindOpen("#acc1 .toggle");
		this.bindOpen("#acc2 .toggle");
		this.bindOpen("#acc3 .toggle");
		this.bindOpen("#acc4 .toggle");
		this.bindOpen("#acc5 .toggle");
		this.bindOpen("#acc6 .toggle");
		
		this.bindClose("#acc1 .toggle");
		this.bindClose("#acc2 .toggle");
		this.bindClose("#acc3 .toggle");
		this.bindClose("#acc4 .toggle");
		this.bindClose("#acc5 .toggle");
		this.bindClose("#acc6 .toggle");
		*/
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

		$("#tree").addClass("active");
		
		$("#acc5").css("display", "block")
		$("#acc5 #basinTitle").html("Basin: " + name);
		
		
		$("#acc5 #years_slider").slider(
			 { 
			max     : 80,
	        min     : 0,
	        range   : 'min',
	        value   : 30,
	        animate : 'fast',
	        slide   : function (event, ui) {
	          $("#acc5 .years").text(ui.value);
	          Streams.yearRange = ui.value;
	          Streams.graphs.updateDate(ui.value);
	        }
	      }
		)
		
		$('#basinSelection').css("display", "none");
		
		$('#acc1').css('width', "440px");
		$('#acc1').parent().attr("state", "open");
		$('#acc5').css('width', "300px");
		$('#acc5').parent().attr("state", "open");
		Streams.app_control.accordionsOpen = 2;
		Streams.app_control.apps.weather_models.getRuns();
		//Streams.app_control.apps.weather_models.getRuns();
  },
  
  /**
   *Binds the target to open itself 
   */
  bindOpen: function(target, amt){
		$(target).bind('mousedown', function(event){
			
			if($(target).parent().attr("state") == "closed" ){
				$(target).parent().css('width', amt + "px");
				var activate = setTimeout(function(){
					$(target).parent().attr("state", "open");
				}, 400);
				Streams.app_control.accordionsOpen++;
			}
			if(Streams.app_control.accordionsOpen > Streams.app_control.accordionLimit){
				console.log("Too Many Open")
				
				var accordions = $("#accordion li");
				console.log(accordions);
				//if(accordionsToClose <= 0){ return; }
				for(var i = 0;i < accordions.length; i++){
					if($(accordions[i]).attr("state") == "open"){
						$(accordions[i]).attr("state", "closed");
						$(accordions[i]).css('width', "30px");
						Streams.app_control.accordionsOpen--;
					}
				if(Streams.app_control.accordionsOpen <= Streams.app_control.accordionLimit){ break; }

				}
				
					
					
			}
			
			
		});
  },

  /**
   *Binds the target to close itself 
   */
  bindClose: function(target){
		$(target).bind("mousedown", function(){
			if($(target).parent().attr("state") == "open" ){
				$(target).parent().css('width', "30px");
				var activate = setTimeout(function(){
					$(target).parent().attr("state", "closed");
				}, 400);
				Streams.app_control.accordionsOpen--;
			}
		});
		
  },
  
  bindCloseIcon: function(target){
  	console.log("CLICK ICON")
		$(target).bind("mousedown", function(){
			if($(target).parent().parent().parent().attr("state") == "open" ){
				$(target).parent().parent().parent().css('width', "30px");
				var activate = setTimeout(function(){
					$(target).parent().parent().parent().attr("state", "closed");
				}, 400);
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
  },
  
  
  addThumbnail:function(dir){
  	var ullist = $("#thumbnailList");
  	$(ullist).empty();
  	//$(ullist).append('<ul id="thumbLabels"><li>Basin</li><li>Climate</li><li>Land</li><li>Flow</li><li>Temperature</li><li>Population</li></ul>')
  	var basinThumb = $('<li><div class="svgDisplay" style="background:url(' + Streams.app_control.apps.basin.basin.thumbnail + '); background-size:100% 100%" id="basinSvg"></div></li>');
  	$(ullist).append(basinThumb);
  	console.log(dir[0].url);
  	for(var i = 0;i < dir.length; i++){
	  	var list = $("<li>");
	  	var listLine = $("#thumbnailList li");
	  	if(listLine.length > 5) {return;}
	  	var thumb = $("<div class='svgDisplay' id='climateSvg'> </div>");
	  	//console.log("http://" + document.location.host + '/' + dir[i].url + "/thumbnail.svg');
	  	$(thumb).css("background", "url('http://" + document.location.host + '/' + dir[i].url + "/thumbnail.svg')");
	  	$(thumb).css("background-size", "100% 100%");
	  	$(list).append(thumb);
	  	$(ullist).append(list);
  	}
  },
  
  getStatus:function(){
  	//console.log(statusObject);
  	//console.log(Status.runningProcesses);
  	for (var i = 0;i < Status.runningProcesses.length;i++){
  		//console.log(Status.runningProcesses[i].responseText);
  		var output = Output.runInformation.parseResponse(Status.runningProcesses[i].responseText);
  		var obj = Output.runInformation.parseResponse(output);
  		console.log(output);
  		console.log(obj);
  		if(obj.run[obj.run.length-1].status == "DONE"){
  			Status.runningProcesses.splice(i, 1);
  			var settings = "http://" + document.location.host + '/' + obj.run[obj.run.length-1].url + '/settings.json';
			$.getJSON(settings, function(data){
				console.log(data);
				Streams.app_control.addThumbnail(obj.run);
				console.log(obj.run[0].url + " : URLLLLLLLLLLLLLLLL")
				Status.clearQueueObject(data.alias, "COMPLETED");
			})
  		} else if(obj.run[obj.run.length-1].status == "FAILED"){
  			Status.runningProcesses.splice(i, 1);
  			var settings = "http://" + document.location.host + '/' + obj.run[obj.run.length-1].url + '/settings.json';
			$.getJSON(settings, function(data){
				console.log(data);
				Status.clearQueueObject(data.alias, "FAILED");
			})
  			
  		} else if (obj.run[obj.run.length-1].status == "WORKING") {
		  console.log('WORKING!!!: ' + Status.runningProcesses[i].runID);
		  var runStatus = $.post('/mexec/status', 
					 {"runID" : Status.runningProcesses[i].runID})		  
		    .done(function(data) { console.log("I FINISHED!") });	
		  runStatus.runID = Status.runningProcesses[i].runID;
		  Status.runningProcesses[i] = runStatus;
		}
  	}
  	
  	
  	
  	//console.log(output);
  },
  
};
