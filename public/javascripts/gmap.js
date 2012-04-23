var GMap = (function init() {
  // Shorthand to access google maps:
	var Map        = google.maps.Map;
  var LatLng     = google.maps.LatLng;
  var InfoWindow = google.maps.InfoWindow;

  // Some useful objects:
  var geocoder = new google.maps.Geocoder();
  var event    = google.maps.event;

  return {
    map: function (mapcanvas, options) {
      return new Map(mapcanvas, options);
    },

    latlng: function (lat, lng) {
      return new LatLng(lat, lng);
    },

    marker: function (latlng, gmap, title) {
      return new google.maps.Marker({
        position: latlng,
        map     : gmap,
        title   : title
      });
    },

    info: function (map, marker, content) {
      var infoWindow = new InfoWindow();
      infoWindow.setContent(content);
      infoWindow.open(map, marker);
      return infoWindow;
    },

    state: function (latlng, cb) {
      geocoder.geocode({ 'latLng' : latlng }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          // Search for state short name:
          for(var ix=0; ix< results[0].address_components.length; ix++) {
            if (results[0].address_components[ix].types[0] == "administrative_area_level_1")
            {
              cb(results[0].address_components[ix].short_name);
            }
          }
        }
        else {
          throw status;
        }        
      });
    },

    event: event,
    
    maptype: google.maps.MapTypeId
  };

})();

