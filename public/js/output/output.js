var Output = {
	
	currentDirectoryList: [],
	
	//TODO: Seperate these correctly
	defaultGraphs:[],
	populationGraphs:[]
	
};

function initOutput(){

}

function storeGraphs(dir){
	console.log(dir);
	Output.populationGraphs = [];
	Output.defaultGraphs = [];
	for(var i = 0; i < dir.length; i++){
		if(dir[i].step == "population"){
			Output.populationGraphs.push('http://' + document.location.host + '/' + dir[i].url + '/plot1.svg');
			Output.populationGraphs.push('http://' + document.location.host + '/' + dir[i].url + '/plot3.svg');
			Output.populationGraphs.push('http://' + document.location.host + '/' + dir[i].url + '/plot4.svg');
	
		
		} else if (dir[i].step == "climate"){
			Output.defaultGraphs.push('http://' + document.location.host + '/' + dir[i].url + '/plot.svg');
			Output.defaultGraphs.push('http://' + document.location.host + '/' + dir[i].url + '/plot2.svg');
		} else if (dir[i].step == "land"){
			
		}else {
			Output.defaultGraphs.push('http://' + document.location.host + '/' + dir[i].url + '/plot.svg');
		}
	}
	
	console.log(Output.defaultGraphs);
	console.log(Output.populationGraphs);
}

function initDefaultGraphs(){
	console.log("DEFAULT");
	var graphs = $('.outputgraph');
	for(var i = 0;i < graphs.length;i++){
		$(graphs[i]).css("background", "url(" + Output.defaultGraphs[i] + ")");
		$(graphs[i]).css("background-size", "100% 100%");
	}
	
}

function initPopulationGraphs(){
	console.log("POPULATION")
	var graphs = $('.outputgraph');
	console.log(graphs);
	for(var i = 0;i < graphs.length;i++){
		$(graphs[i]).css("background", "url(" + Output.populationGraphs[i] + ")");
		$(graphs[i]).css("background-size", "100% 100%");
	}
}


function removeOutput(){
	$("#inputDropBox").css("display", "none");
	$('#graphSelectionList').remove();
}

function buildGraphBoxes(runArray){
	console.log(runArray);
	console.log("Initializing Outputs");
	
	$("#graphSelectionList").remove();
	
	$("#view_climate").button();
	
	$("#view_climate").click(function(){
		console.log("LOADING DEFAULTS")
		if(Output.defaultGraphs.length != 0){
			initDefaultGraphs();
			$("#inputWrapper").css("top","-200%");
		$("#outputWrapper").css("top","-100%");
		$("#graphWrapper").css("top","0%");
		}
	});
	
	$("#view_population").button();
	$("#view_population").click(function(){
		console.log("LOADING POPULATION")
		if(Output.populationGraphs.length != 0){
			initPopulationGraphs();
			$("#inputWrapper").css("top","-200%");
		$("#outputWrapper").css("top","-100%");
		$("#graphWrapper").css("top","0%");
		}
	});
	
	/*TODO: Figure out Output Graph Selection
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
	*/
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
