$(function() {
  var mapcanvas = $('div#map');
  var options = {
    center : GMap.latlng(-111.1563, 39.4725),
    zoom : 17,
    mapTypeId : google.maps.MapTypeId.ROADMAP
  };
  
  GMap.map(mapcanvas, options);
});
