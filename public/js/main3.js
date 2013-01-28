/** The main module for the Streams application.
 */
var Streams = {};

// Connect to the server using SocketIO:
Streams.socket = io.connect();

$(function () {
	
	//document.body.style.zoom="90%"
	
  Streams.view = $('body');
  
  Streams.map.init();
  Streams.app_control.init();

  Streams.map.render();
  Streams.app_control.render();
  
  Chart.init();
  initNavigation();
  
});


function initNavigation(){
	$("#navigation #inputButton").button({disabled:true});
	$("#navigation #outputButton").button({disabled:true});
	$("#navigation #graphButton").button({disabled:true});
	
	$("#navigation #inputButton").bind("click", function(){
		//initOutput();
		$("#inputWrapper").css("top","0%");
		$("#outputWrapper").css("top","100%");
	});
	
	
	
	$("#navigation #outputButton").bind("click", function(){
		initOutput();
		$("#inputWrapper").css("top","-100%");
		$("#outputWrapper").css("top","0%");
	});
	
	
}

function enableButton(button){
	$("#navigation #"+ button).button({disabled:false});
}
