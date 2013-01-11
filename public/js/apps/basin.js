/* The Basin Application
 */
Streams.app_control.apps.basin = {
  name : 'Basin Selection',
  order: 1,
  init : function () {
  	
  	
  	/// Initialize Functionality ////

    // This is used to disable event handlers when
    // a basin lookup is in progress. We want to disable
    // the selection of another basin when a lookup is
    // in progress.
    var disableHandlers = false;

    // Keeps track of basins.
    // NOTE: Do we need this? Do we ever need to consult this table?
    var basinTable  = {};

    // The next basin id:
    var nextBasinId = 0;
    

    //// Initialize View ////
    var jsonData = '{"basins":[{"name":"basinOne", "id":293}, {"name":"basinTwo","id":192}]}';
    var jsonObj = JSON && JSON.parse(jsonData) || $.parseJSON(jsonData);
    console.log(jsonObj);
    
    var basin_view    = $('<div id="basin-app">');
    var loader        = $('<div id="loader">');
    var message       = $('<div id="msg">');
    var prompt_header = $('<div id="prompt_header">');
    var prompt        = $('<div id="prompt">');
    var sim_period	  = $('<div id="sim">');
    var basinList	  = $('<ul id="basinList">');
    var rscript       = $('<div id="rscript">');
    
    var save_message  = $('<div id="save_message">');

   
    
    
  	//Append Items to Basin View
    basin_view
      .append(loader.append(message))
      .append(prompt_header)
      .append(prompt)
      .append(rscript)
      .append(basinList)
      .append(sim_period)
      .append(save_message);
    this.view = basin_view;
    prompt.empty();
        rscript.empty();
    
    
    //Add class to basin view
    $(basin_view).addClass("basinApplication");
   
   //Add class to basin List
   $(basinList).addClass("basinList");
   
   function startBasinDialog(){
   	 prompt_header.html('<p>Right click the map to select a point to delineate a basin.</p>' + 
    	'<br /><p> - OR - </p><br /> <p>Select a previous basin:</p>'
    	);
   }
	
	function loadSavedBasins(){
		console.log("Loading Saved Basins");
		for (var i=0;i<jsonObj.basins.length;i++){
			console.log(jsonObj.basins[i]);
			var listItem = $('<li>' + jsonObj.basins[i].name + ': ' + jsonObj.basins[i].id + '</li>');
			$(listItem).attr("name", jsonObj.basins[i].name);
			$(listItem).attr("id", jsonObj.basins[i].id);
			listItem.id = jsonObj.basins[i].id;
			basinList.append(listItem);	
			$(listItem).bind('mousedown', function(e){	
				console.log(e);
				loadBasin($(this).attr("name"), $(this).attr("id"));
			});	
		}
	}
	
	/**
	 * Loads the Selected Basin
 	 * @param {Object} name Name of Basin
 	 * @param {Object} id Unique Id
	 */
	function loadBasin(name, id){
		prompt_header.fadeIn();
		Streams.map.hide();
		Streams.app_control.initSteps();
		Streams.app_control.enableSteps();
		basinList.empty();
		prompt_header.html('<br><h2><center>Basin: ' + name + '</h2>')
		prompt.html('<center><button id="newBasin">Select New Basin</button>')
		
		sim_period.html('<br><br><br><p><center><h2>Simulation Period:</h2><p><b><span class="years">30</span> Years<br><div id="years_slider"></div>')
		var simText = $(sim_period).find(".years");
		var simSlider = $(sim_period).find("#years_slider");
		simSlider.slider(
			 { 
			max     : 80,
	        min     : 0,
	        range   : 'min',
	        value   : 30,
	        animate : 'fast',
	        slide   : function (event, ui) {
	          simText.text(ui.value);
	        }
	      }
		)
	
		//Streams.app_control.addClass(".basinSelection-control", "full-height");
		
		$(prompt).find("#newBasin").bind("mousedown", function(){
			$(prompt).empty();
			$(prompt_header).empty();
			sim_period.empty();
			Streams.map.show();
			loadSavedBasins();
			Streams.app_control.disableSteps();

			startBasinDialog();
						
		});
	}
	
	
	
    //Loads Basin Delineation
    function rightClickEvent (event) {
    	resetPrompt();
      // Return if a basin lookup is in progress:
      if (disableHandlers)
        return;
      
      basinList.empty();
      
      // Disable handlers:
      disableHandlers = true;
      
      // Create and display the marker:
      var marker = Streams.map.makeMarker(event.latLng, '');
      Streams.map.addMarker(marker);
      console.log(event.latLng);

      // Create the info window:
      var info   = Streams.map.makeInfoWindow();

      // Create and add a new basin object:
      var basin  = {
        id     : nextBasinId++,
        marker : marker,
        info   : info
      };
      basinTable[basin.id] = basin;
      
      //// STATE MACHINE ////
      
      // This resets the prompt view to select another basin:
      function resetPrompt () {
        disableHandlers = false;
        prompt.empty();
        rscript.empty();
        save_message.empty();
        basinList.empty();
        prompt_header.fadeIn();
        
        
         Streams.app_control.addClass(".basinSelection-control", "get-basin");
         Streams.app_control.removeClass(".basinSelection-control", "drainage-model");
         Streams.app_control.removeClass(".basinSelection-control", "select-basin");
      }
      

      // This function sends a message to the server to initiate a
      // KML download from streamstats.
      function request_kml () {
        // Grab the socket:
        var socket   = Streams.socket;
        var position = marker.getPosition();
        var getState = Streams.map.getState;

        getState(position,
                 function (state_name) {
                   var message  = {
                     state : state_name,
                     lat   : position.lat(),
                     lng   : position.lng() 
                   };                   
                   socket.emit('marker', message);
                 });
                 
        
      }

      // This function displays the initial loading messages
      // when a point on the map is clicked to select a basin.
      function retrieve_info () {
        var position = marker.getPosition();
        var lat      = position.lat().toPrecision(4);
        var lng      = position.lng().toPrecision(4);
		
		message.fadeIn('slow', function () { });
		
		$(message).empty();
		
        message.append('Retrieving (~1min) @ ' + lat + ', ' + lng);
        message.append('<img src="images/ajax-loader.gif"/>');
        console.log("Looking for Position");

        info.setContent('<div class="infowindow">Retrieving data...</div>');
        Streams.map.openInfoWindow(info, marker);
        
        prompt_header.fadeOut();
      }

      // This function is invoked when the KML data has been
      // loaded from the streamstats web service.
      function receive_kml (data) {
        message.fadeOut('slow', function () { });

        // Close the info window:
        Streams.map.closeInfoWindow(info);
        // Layer the KML object onto the map:
        var loc = 'http://' + document.location.host + '/' + data.kmlpath;
        var kml = Streams.map.loadKMLLayer(loc);
        // Save kml object in the basin object:
        basin.kml = kml;
        // Save the drainage model URL in the basin object:
        basin.drainage_url = data.props.drainId;
        // Remove marker:
        marker.setMap(null);
        // Verify basin:
        verify_basin();
      }

      // This function is invoked when there is an error loading the
      // KML file from the streamstats website. It is called typically
      // when the streamstats service is unavailable.
      function kml_error (data) {
      	
        message.fadeOut('slow', function () { });
        Streams.map.closeInfoWindow(info);
        Streams.map.deleteMarker(marker);
        prompt.append('<p class="error">Error: ' + data.msg + '</p>');
        console.log(data.msg);
        disableHandlers = false;
      }

      // This function prompts the user when the basin is overlayed onto
      // the google map. It asks the user if this is the basin they
      // are interested in.
      function verify_basin () {
      	disableHandlers = false;
      	Streams.app_control.addClass(".basinSelection-control", "select-basin");
      	Streams.app_control.removeClass(".basinSelection-control", "get-basin");
        var p1 = $('<center><p><h1>Use this point?</h1></p>' +
                   '<p>Enter a Unique Name for your basin and press Save.</p>'
                   );
                   
        //Save Basin Prompt           
        var sv = $('<br><center><h2>Basin Reference Name</h2>' + '<br />' + 
        		'<input type="text" id="refName" value="Enter Name"></input>' + '<br>' +
        		'<button id="savebtn" href="">Save Basin</button>');
        save_message.html(sv);

        prompt.html(p1);
        $(sv).find('#savebtn').click(function (event) {
          event.preventDefault();
         
          var saveName = $(sv).find('input').val();
          console.log(saveName);
          if(saveName == "Enter Name" || saveName == ""){
          	return;
          	this.alert("Please provide a basin name");
          }
           save_message.empty();
          //select_model();
          save_message.empty();
          prompt.empty();
          loadBasin(saveName, Math.floor(Math.random()*400));
        });
        
		
       
        
      }

      // This function prompts the user to select model to run and
      // displays the results in the prompt view.
      function select_model () {
       
        
        Streams.map.hide();

        $(p2).find('#p2-drainage').click(function (event) {
          var url = basin.drainage_url;
          console.log('Drainage URL: ' + url);
          rscript.empty();
          rscript.hide();
          rscript.append(url);
          rscript.fadeIn('slow', function () {})
          Streams.app_control.removeClass(".basinSelection-control", "select-basin");
          Streams.app_control.addClass(".basinSelection-control", "drainage-model");
        });

        $(p2).find('#p2-newbasin').click(function (event) {
          event.preventDefault();
          resetPrompt();
        });
        
        // Allow the map to be clicked again:
        disableHandlers = false;
      }

      //// The Main Driver ////
      Streams.socket.on('kmldone', receive_kml);
      Streams.socket.on('kmlerror', kml_error);
      retrieve_info();
      request_kml();

      return false;
    }
	
	//Start first basin dialog
	startBasinDialog()
	
	//Load Saved Basins
	loadSavedBasins();
	
    // Now register the events:
    Streams.map.addListener('rightclick', rightClickEvent);
  }
};
