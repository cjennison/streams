/** The main module for the Streams application.
 */
var Streams = {};

// Connect to the server using SocketIO:
Streams.socket = io.connect();

$(function () {
	
	document.body.style.zoom="75%"
	
  Streams.view = $('body');
  
  Streams.map.init();
  Streams.app_control.init();

  Streams.map.render();
  Streams.app_control.render();
  
  Chart.init();
  
});