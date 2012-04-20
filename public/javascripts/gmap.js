var GMap = (function init() {
	var Map = google.maps.Map;
  var LatLng = google.maps.LatLng;
  
  return {
    map: function (mapcanvas, options) {
      return new Map(mapcanvas, options);
    },

    latlng: function (lat, lng) {
      return new LatLng(lat, lng);
    },
    
    maptype: google.maps.MapTypeId
  };

})();

