/** The Map Module
 */
Streams.map = {
  name : 'Map',
  
  init : function () {
    Streams.map.view = $('div#map')[0];
  },

  render : function () {
    // Options for the default map to display.
    var options = {
      center : GMap.latlng(42.39019, -72.43307),
      zoom : 17,
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
    var map = GMap.map(Streams.map.view, options);

    // Make the map available:
    this._map = map;

    //// TESTING ////
    var gadges = new google.maps.KmlLayer('http://livestreams.herokuapp.com/GagesUsed.kmz',
                                          { preserveViewport :  true,
                                            clickable : true });
    gadges.setMap(map);
    var ct_watershed = new google.maps.KmlLayer('http://livestreams.herokuapp.com/ct_watershed.kmz',
                                                { preserveViewport :  true,
                                                  clickable : false });
    ct_watershed.setMap(map);

    var fortRiver = new google.maps.KmlLayer('http://livestreams.herokuapp.com/Fort_River.kml',
                                             { preserveViewport : true,
                                               clickable : true });
    fortRiver.setMap(map);

    google.maps.event.addListener(fortRiver, 'click', function (event) {
      console.debug(event);
    });
    //// TESTING ////
  },

  addListener : function (event, fn) {
    console.log('Adding listener on map for ' + event);
    GMap.event.addListener(this._map, event, fn);
  },

  makeMarker : function (latLng, title) {
    return GMap.marker2(latLng, title);
  },

  addMarker : function (marker) {
    marker.setMap(this._map);
  },

  deleteMarker : function (marker) {
    marker.setMap(null);
  },

  makeInfoWindow : function () {
    return GMap.info2();
  },

  openInfoWindow : function (info, marker) {
    info.open(this._map, marker);
  },

  closeInfoWindow : function (info) {
    info.close();
  },

  loadKMLLayer : function (url) {
    return GMap.kml(this._map, url);
  },

  getState : function (position, fn) {
    GMap.state(position, fn);
  }

};