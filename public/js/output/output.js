var Output = {};

function initOutput(){

	
	
}


function removeOutput(){
	$("#inputDropBox").css("display", "none");
	$('#graphSelectionList').remove();
}

function buildGraphBoxes(runArray){
	console.log(runArray);
	console.log("Initializing Outputs");
	
	$("#graphSelectionList").remove();
	
	
	var graphContainer = $('#graphContainer');
	var graphSelectionList = $('<ul id="graphSelectionList">');
	
	var graphType = ["basin", "climate", "land", "flow", "temp","fish"];
	
	for(var q = 0; q < graphType.length; q++){
		var listItem = $("<li>");
		var graphUnorderedList = $("<ul id='" + graphType[q] + "GraphList' class='graphList'></ul>")
		
		$(listItem).append(graphUnorderedList);
		$(graphSelectionList).append(listItem);
		
	}
	
	$(graphContainer).append(graphSelectionList);
	
	
	for(var c = 0;c < runArray.length; c++){
		var list = $("#" + graphType[runArray[c].depth] + "GraphList");
		console.log(runArray[0]);
		var box = $("<div class='graphBox' style='color:black; font-size:12px'></div>")
		$(box).html(runArray[c].name)
		list.append(box);
	}
	
	
	
	var boxLength = $(".graphBox").length;
	
	for(var i = 0; i < boxLength; i++){
		DragHandler.attach($(".graphBox")[i]);
	}
	
	$("#inputDropBox").css("display", "none");
}


function buildCheckBoxes(numBoxes, runArray){
	console.log("Building " + numBoxes + " boxes.");
	console.log(runArray)
	$("#checkBoxes").remove();
	
	var container = $("<div id='checkBoxes'><ul>");
	var ul = $("<ul>");
	
	for(var i=0;i<numBoxes;i++){
		var checkbox = $("<li style='margin-top:" + runArray[i].x + "px'><input type='checkbox' name='c1' value='cc'>");
		var label = $('<label for="c1"><span></span></label>');
		$(ul).append(checkbox);
		$(checkbox).append(label);
	}
	
	
	$(container).append(ul);
	$("#treeContainer").append(container);
	
}
