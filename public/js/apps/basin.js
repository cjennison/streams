/* The Basin Application
 */
Streams.app_control.apps.basin = {
  name : 'Basin Selection',
  order: 1,
  init : function () {
    //// Initialize View ////
    
    var basin_view    = $('<div id="basin-app">');
    var loader        = $('<div id="loader">');
    var message       = $('<div id="msg">');
    var prompt_header = $('<div id="prompt_header">');
    var prompt        = $('<div id="prompt">');
    var rscript       = $('<div id="rscript">');

    prompt_header.html('Right click the map to select a point to delineate a basin.');
  
    basin_view
      .append(loader.append(message))
      .append(prompt_header)
      .append(prompt)
      .append(rscript);
    this.view = basin_view;
    prompt.empty();
        rscript.empty();
        
    $(basin_view).addClass("basinApplication");
   
	
    //// Initialize Functionality ////

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

    function rightClickEvent (event) {
      // Return if a basin lookup is in progress:
      if (disableHandlers)
        return;
      
     
      
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
        
        prompt_header.fadeIn();
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
      	 Streams.app_control.addClass(".basinSelection-control", "select-basin");
        var p1 = $('<p>Use this point?</p>' +
                   '<center><p><button id="p1-yes" href="">Use This Point</button>' + '<br>' +
                   '<p><button id="p1-no" href="">Pick a New Point</button>' 
                   );

        prompt.html(p1);
        $(p1).find('#p1-yes').click(function (event) {
          event.preventDefault();
          select_model();
        });
        
		
        $(p1).find('#p1-no').click(function (event) {
          event.preventDefault();
          resetPrompt();
          // TODO: do I remove the basin from the display?
        });
        
      }

      // This function prompts the user to select model to run and
      // displays the results in the prompt view.
      function select_model () {
        var p2 =
          $('<p>Please choose a model to run:</p>' +
            '<form>' +
            '<input type="radio" name="model" id="p2-drainage">Drainage</input><br/>' +
            '<input type="radio" name="model" disabled="disabled" id="p2-other">Other Model</input><br/>' +
            '</form>' +
            '<p>Or choose a <a href="" id="p2-newbasin">new basin</a>.</p>');
        $('div#prompt').html(p2);

        $(p2).find('#p2-drainage').click(function (event) {
          var url = basin.drainage_url;
          console.log('Drainage URL: ' + url);
          rscript.empty();
          rscript.hide();
          rscript.append(url);
          rscript.fadeIn('slow', function () {})
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

    // Now register the events:
    Streams.map.addListener('rightclick', rightClickEvent);
  }
};
