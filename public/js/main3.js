/** The main module for the Streams application.
 */
var Streams = {};
Streams.user = null;

// Connect to the server using SocketIO:
Streams.socket = io.connect();

$(function () {
	
Streams.user = $(".username").html();
console.log(Streams.user);
	
  Streams.view = $('body');
  
  Streams.map.init();
  Streams.app_control.init();

  Streams.map.render();
  Streams.app_control.render();
  
  //Chart.init("#tree", "../json/data.json", 800, 385, 200, 010, 210, 180, 25, "null");
  Chart.init("#treeContainer", "../json/data2.json", 1100, 455, 55, 70, 147, 80, 25, "output");
  initNavigation();
  Status.init();
});

function initNavigation(){
	$("#navBar #inputButton").button({disabled:false});
	$("#navBar #outputButton").button({disabled:false});
	$("#navBar #graphButton").button({disabled:false});
	
	$("#navBar #inputButton").bind("click", function(){
		removeOutput();
		$("#inputWrapper").css("top","0%");
		$("#outputWrapper").css("top","100%");
		$("#graphWrapper").css("top","200%");
	});
	
	$("#navBar #outputButton").bind("click", function(){
		initOutput();
		$("#inputWrapper").css("top","-100%");
		$("#outputWrapper").css("top","0%");
		$("#graphWrapper").css("top","100%");
	});
	
	$("#navBar #graphButton").bind("click", function(){
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

(function($) {
    $.fn.getAttributes = function() {
        var attributes = {}; 

        if( this.length ) {
            $.each( this[0].attributes, function( index, attr ) {
                attributes[ attr.name ] = attr.value;
            } ); 
        }

        return attributes;
    };
})(jQuery);
