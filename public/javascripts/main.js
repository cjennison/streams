$(function() {
  // Run web sockets:
  var socket = io.connect();

  var mapcanvas = $('div#map')[0];

  // Options for the default map to display.
  // TODO: where should the initial map display?
  var options = {
    center : GMap.latlng(42.39019, -72.43307),
    zoom : 14,
    mapTypeId : google.maps.MapTypeId.TERRAIN,


    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_CENTER
    },
    panControl: false,
    panControlOptions: {
      position: google.maps.ControlPosition.TOP_RIGHT
    },
    zoomControl: true,
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.LARGE,
      position: google.maps.ControlPosition.TOP_LEFT
    },
    scaleControl: true,
    scaleControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER
    },
    streetViewControl: false,
    streetViewControlOptions: {
      position: google.maps.ControlPosition.LEFT_TOP
    }
  };

  // Construct the map:
  var map = GMap.map(mapcanvas, options);

  // Global info window to be used to display loading status:
  var loadingInfo;
   
  // google.maps.KmlLayer('http://livestream.herokuapp.com/GagesUsed.kmz');
  // google.maps.KmlLayer('/ct_watershed.kmz');

  // Click event on the map. This adds a marker on the clicked
  // location. It will also send an Ajax call to the server to
  // initiate the downloading of the KML file.
  GMap.event.addListener(map, 'click', function (event) {
    // Create a new marker and add it to the map:
    var marker = GMap.marker(event.latLng, map, '');

    // Set the latitude/longitude:
    var lat = $('span#lat');
    var lng = $('span#lng');
    lat.html(event.latLng.lat());
    lng.html(event.latLng.lng());
    
    loadingInfo = GMap.info(map, marker,
                            '<b>Retrieving from stream stats @ ' +
                            lat.html() + ', ' + lng.html() + '</b>');

    GMap.state(event.latLng, function (name) {
      socket.emit('marker', { 'state' : name,
                              'lat'   : event.latLng.lat(),
                              'lng'   : event.latLng.lng() });
    });
  });

  socket.on('kmldone', function (data) {
    var loc = 'http://' + document.location.host + '/' + data.kmlpath;
    console.log('layering ' + loc);
    var geoRssLayer = new google.maps.KmlLayer(loc, { preserveViewport :  true });
    console.log('Setting geoRssLayer');
    
    // Close the info window:
    loadingInfo.close();
    geoRssLayer.setMap(map);
    
    console.log('Drain ID = ' + data.props.drainId);
    
    /*
    var rscript = 'http://streams.ecs.umass.edu/gmap_script.php';
    var cmd = rscript + '?y=' + data.lat + '&x=' + data.lng 
                          + '&da=' + data.props.drainId;
    */

    // RScript support:
    var rscript = $('div#rscript');
    rscript.empty();
    rscript.hide();
    rscript.append(data.props.drainId);
    setTimeout(function () {
      rscript.fadeIn('slow', function () {});
    }, 1000);

    // Set center
    //var latlng = GMap.latlng(data.lat, data.lng);
    //map.setZoom(14);
    //map.setCenter(latlng);
  });
});
