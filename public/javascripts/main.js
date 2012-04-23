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

  // Click event on the map. This adds a marker on the clicked
  // location. It will also send an Ajax call to the server to
  // initiate the downloading of the KML file.
  GMap.event.addListener(map, 'click', function (event) {
    // Create a new marker and add it to the map:
    GMap.marker(event.latLng, map, '');

    // Set the latitude/longitude:
    var lat = $('span#lat');
    var lng = $('span#lng');
    lat.html(event.latLng.lat());
    lng.html(event.latLng.lng());

    GMap.state(event.latLng, function (name) {
      socket.emit('marker', { 'state' : name,
                              'lat'   : event.latLng.lat(),
                              'lng'   : event.latLng.lng() });
    });
  });

  socket.on('kmldone', function (data) {
    console.log(data);
    var geoRssLayer = new google.maps.KmlLayer(data.kmlpath);
    console.log('Setting geoRssLayer');
    geoRssLayer.setMap(map);
  });
});
