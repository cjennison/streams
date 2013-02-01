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
  
  Chart.init("#tree", "../json/data.json", 800, 385, 200, 260, 210, 180, 25, "null");
  Chart.init("#treeContainer", "../json/data2.json", 1100, 455, 55, 70, 147, 80, 25, "output");
  initNavigation();
  
});


function initNavigation(){
	$("#navigation #inputButton").button({disabled:true});
	$("#navigation #outputButton").button({disabled:false});
	$("#navigation #graphButton").button({disabled:true});
	
	$("#navigation #inputButton").bind("click", function(){
		removeOutput();
		$("#inputWrapper").css("top","0%");
		$("#outputWrapper").css("top","100%");
		$("#graphWrapper").css("top","200%");
	});
	
	$("#navigation #outputButton").bind("click", function(){
		initOutput();
		$("#inputWrapper").css("top","-100%");
		$("#outputWrapper").css("top","0%");
		$("#graphWrapper").css("top","100%");
	});
	
	$("#navigation #graphButton").bind("click", function(){
		removeOutput();
		initGraph();
		$("#inputWrapper").css("top","-200%");
		$("#outputWrapper").css("top","-100%");
		$("#graphWrapper").css("top","0%");
	});
}

function enableButton(button){
	$("#navigation #"+ button).button({disabled:false});
}
