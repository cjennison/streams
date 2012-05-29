
var Basin = (function init () {
  // This is used to disable event handlers when a basin lookup is in progress.
  var disableHandlers = false;
  
  // Return an object representing the Basin module:
  return {
    
    // The basin function is used to initiate a basin process:
    basin: function ($, GMap, map, marker, socket) {
      // Return if a basin lookup is in progress:
      if (disableHandlers)
        return;

      // Disable handlers:
      disableHandlers = true;

      // Display the marker:
      marker.setMap(map);
      
      var info     = GMap.info2();         // Create the InfoWindow.
      var position = marker.getPosition(); // Get the marker position.

      // The initial basin object:
      var basin = {
        jquery: $,
        map: map,
        marker: marker,
        socket: socket,
        info: info
      };
      
      // This function sends a message to the server to initiate a
      // KML download from streamstats.
      function request_kml () {
        GMap.state(position, function (state_name) {
          socket.emit('marker', { state : state_name,
                                  lat   : position.lat(),
                                  lng   : position.lng() });
        });
      }
      
      function retrieve_info () {
        var loader = $('div#loader > #msg');        
        var lat    = position.lat().toPrecision(4);
        var lng    = position.lng().toPrecision(4);

        loader.append('Loading basin (~1min) at ' +
                      lat + ', ' +
                      lng);
        loader.append('<img src="images/ajax-loader.gif"/>');

        info.setContent('<div class="infowindow">Retrieving data...</div>');
        info.open(map, marker);
      }

      function receive_kml (data) {
        var ldr  = $('div#loader > #msg');
        ldr.fadeOut('slow', function () { });

        // Close the info window:
        info.close();
        // Layer the KML object onto the map:
        var loc = 'http://' + document.location.host + '/' + data.kmlpath;
        var kml = GMap.kml(map, loc);
        // Save kml object in the basin object:
        basin.kml = kml;
        // Save the drainage model URL in the basin object:
        basin.drainage_url = data.props.drainId;
        verify_basin();
      }

      function kml_error (data) {
        var ldr  = $('div#loader > #msg');
        ldr.fadeOut('slow', function () { });
        basin.info.close();
        basin.marker.setMap(null);
        $('div#prompt').append('<p class="error">Error: ' + data.msg + '</p>');
        console.log(data.msg);
        disableHandlers = false;
      }

      // 1. Choose a point for delineating a basin
      //   2. Is this the basin you wanted (Yes/No) - where no would bring the
      //   user back to selecting a new point, if yes then go to next step
      // I think step 2.5 will be a menu/check boxes that allows the user to
      //   select which models will be run, right now we only have one model
      // 3. A button to run the algorithm we have setup on our server now
      // 4. Last step would be choice of data export and whether the user
      //   wanted to do this for a new basin
      
      function verify_basin () {
        var p1 = $('<p>Is this the basin you wanted?</p>' +
                   '<p><a id="p1-yes" href="">Yes</a> or ' +
                   '<a id="p1-no" href="">No</a></p>');

        $('div#prompt').append(p1);
        
        $(p1).find('#p1-yes').click(function (event) {
          console.log('p1-yes handler invoked.');
          event.preventDefault();
          select_model();
        });

        $(p1).find('#p1-no').click(function (event) {
          event.preventDefault();
          // call reset on basin...
        });

      }

      function select_model () {
        var p2 = $('<p>Please choose a model to run:</p>' +
                   '<form>' +
                   '<input type="radio" name="model" id="p2-drainage">Drainage</input><br/>' +
                   '<input type="radio" name="model" id="p2-other">Other Model</input><br/>' +
                   '</form>');
        $('div#prompt').append(p2);

        $(p2).find('#p2-drainage').click(function (event) {
          var url = basin.drainage_url;
          var rscript = $('div#rscript');
          rscript.empty();
          rscript.hide();
          rscript.append(data.props.drainId);
          rscript.fadeIn('slow', function () {})
        });
        
        // Allow the map to be clicked again:
        disableHandlers = false;
      }


      //// The Main Driver ////
      socket.on('kmldone', receive_kml);
      socket.on('kmlerror', kml_error);
      retrieve_info();
      request_kml();
      
      // Return the basic object:
      return basin;
    }
    
  }
})();
