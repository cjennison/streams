var Output = {};

function initOutput(){

	console.log("Initializing Outputs");
	var graphContainer = $('#graphContainer');
	var graphSelectionList = $('<ul id="graphSelectionList">');
	
	var graphType = ["basin", "climate", "land", "flow", "temp","fish"];
	
	for(var q = 0; q < graphType.length; q++){
		var listItem = $("<li>");
		var graphUnorderedList = $("<ul id='" + graphType[q] + "GraphList' class='graphList'></ul>")
		
		
		//TODO: Get Info from JSON
		for(var f = 0 ;f < Math.floor(Math.random()*4) + 1;f++){
			var graphBoxListItem = $("<li>");
			var graphBox = $('<div class="graphBox"></div>');
			var graphText = $('<span class="graphText"></span>');
			$(graphText).text("Run Name");
			$(graphBox).append(graphText);
			$(graphBoxListItem).append(graphBox);
			$(graphUnorderedList).append(graphBoxListItem);
		}
		
		
		
		
		$(listItem).append(graphUnorderedList);
		$(graphSelectionList).append(listItem);
		
	}
	
	$(graphContainer).append(graphSelectionList);
	
	
	
	var boxLength = $(".graphBox").length;
	
	for(var i = 0; i < boxLength; i++){
		DragHandler.attach($(".graphBox")[i]);
	}
	
	$("#inputDropBox").css("display", "none");
	
}


function removeOutput(){
	$("#inputDropBox").css("display", "none");
	$('#graphSelectionList').remove();
}
