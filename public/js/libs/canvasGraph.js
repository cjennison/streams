Streams.graphs = {
	
	
	
	init:function(container, state, min, max, xLabel, yLabel){

		this.setupGraph(container, state, min, max, xLabel, yLabel);

	},
	
	
	
	setupGraph:function(container, state, min, max, xLabel, yLabel){
	//Define the stage
	 var stage = new Kinetic.Stage({
        container: container,
        width: 578,
        height: 100
      });
	
	//Define the working layer
      var layer = new Kinetic.Layer();
    //Left Node
      var leftNode = new Kinetic.Circle({
        x: 40,
        y: stage.getHeight() / 2,
        radius: 3,
        fill: 'orange',
        
      });
     //Right Node
      var rightNode = new Kinetic.Circle({
        x: 380,
        y: stage.getHeight() / 2,
        radius: 10,
        fill: 'orange',
        dragBoundFunc: function(pos) {
          return {
            x: this.getAbsolutePosition().x,
            y: pos.y
          }
        }
      });
      
      //Central Line
      var line = new Kinetic.Line({
      	points: [leftNode.getX(), leftNode.getY(), rightNode.getX(), rightNode.getY()],
      	stroke: 'orange',
        strokeWidth: 2,
        lineCap: 'round',
        lineJoin: 'round',
        dragBoundFunc: function(pos) {
          return {
            x: this.getAbsolutePosition().x,
            y: this.getAbsolutePosition().y
          }
        }
      });
      
      //Variance Line
      var vline = new Kinetic.Line({
      	points: [leftNode.getX(), leftNode.getY(), rightNode.getX(), rightNode.getY()],
      	stroke: 'grey',
        strokeWidth: 10,
        lineCap: 'round',
        lineJoin: 'round',
        dragBoundFunc: function(pos) {
          return {
            x: this.getAbsolutePosition().x,
            y: this.getAbsolutePosition().y
          }
        }
      });
      
      //BG for MouseEvents
      var bg = new Kinetic.Rect({
      	x:0,
      	y:0,
      	width: 578,
      	height: stage.getWidth(),
      	fill:'white',
      });
	
	//Contain all elements within group
      var group = new Kinetic.Group({
      	dragBoundFunc: function(pos) {
          return {
            x: this.getAbsolutePosition().x,
            y: pos.y
          }
        }
      });
      
      
      
      //Add All Elements to the Group
      
      
      if(state == "mean_var"){
      	 group.add(vline);
      	 console.log("ADDED LINE")
      }
	  group.add(line);
      group.add(leftNode);
      group.add(rightNode);
      
      //Add Elements to Layer
      layer.add(bg);
      layer.add(drawGraph());
      layer.add(group);
      
      var startingY = 0;
      var mouseY = 0;
      var resizing = false;
      
      
      
      
      
    	
      vline.on('mousedown', function(){
      	startingY = stage.getMousePosition().y;
      	mouseY = stage.getMousePosition().y;
      	resizing = true;
      });
      
      line.on('mousedown', function(){
      	startingY = stage.getMousePosition().y;
      	mouseY = stage.getMousePosition().y;
      	resizing = true;
      });
      
      layer.on('mousemove', function(){
      	if(!resizing){
      		return;
      	}
      	mouseY = stage.getMousePosition().y;
      	
      	
      	
      	if(mouseY < startingY){
      		var strk = vline.getStrokeWidth();
      		if(strk < 20){
      			strk+=1;
      		}
      		vline.setStrokeWidth(strk);
      		
      	} else if(mouseY > startingY){
      		var strk = vline.getStrokeWidth();
      		if(strk > 5){
      			strk-=1;
      		}
      		
      		
      		vline.setStrokeWidth(strk);
      	}
      	Streams.app_control.apps.weather_models.updateText('#precip02-value', Math.round(vline.getStrokeWidth()/3 - 1.25));
      	//document.getElementsByClassName('variance')[0].innerHTML = Math.round(vline.getStrokeWidth()/3 - 1.25);
      	
      	startingY = stage.getMousePosition().y;
      	stage.draw();
      });
      
      layer.on('mouseup', function(){
      	resizing = false;
      	startingY = 0;
      	mouseY = 0;
      })
      
		 rightNode.setDraggable(true);
      rightNode.on('dragstart', function() {
      	updateLine([leftNode.getX(), leftNode.getY(), rightNode.getX(), rightNode.getY()]);
      });
      rightNode.on('dragmove', function() {
      	updateLine([leftNode.getX(), leftNode.getY(), rightNode.getX(), rightNode.getY()]);
      });
      rightNode.on('dragend', function() {
      	updateLine([leftNode.getX(), leftNode.getY(), rightNode.getX(), rightNode.getY()]);
      });
      
      function updateLine(points){
      	line.setPoints(points);
      	vline.setPoints(points);
      	
      	var changeInY = Math.round((((rightNode.getY()-50)*-1)/10)-.2);
      	
      	
      	 if(state == "mean_var"){
      		Streams.app_control.apps.weather_models.updateText('#precip01-value', changeInY);
      	 } else  if(state == "temp"){
      	 	 Streams.app_control.apps.weather_models.updateText('#mean-temp-value', changeInY);

      	 }
      	
      	
      	 stage.draw();
      }
      
      //Draw Graph Background
      function drawGraph(){
      	
      	var YAxis = new Kinetic.Line({
	        points: [40, 0, 40, stage.getHeight()],
	        stroke: 'black',
	        strokeWidth: 1
	       
	      });
	    
	    var XAxis = new Kinetic.Line({
	        points: [40, stage.getHeight()/2 + 1, 370, stage.getHeight()/2 + 1],
	        stroke: 'black',
	        strokeWidth: 1
	       
	      });
	      
	     var XAxisText = new Kinetic.Text({
	        x: stage.getWidth() / 2 - 120,
	        y: stage.getHeight()/2 + 15,
	        text: xLabel,
	        fontSize: 13,
	        fontFamily: 'Calibri',
	        fill: 'black'
	      });
	      
	      var YAxisText = new Kinetic.Text({
	        x: 40,
	        y: stage.getHeight()/2 + 20,
	        text: yLabel,
	        fontSize: 13,
	        fontFamily: 'Calibri',
	        offset: [20, (stage.getHeight()/2 + 15)/2],
	        fill: 'black'
	      });
	      
	      YAxisText.setRotationDeg(-90);
		   
		   
		  var YAxisNumber= new Kinetic.Text({
	        x: 25,
	        y: stage.getHeight()/2 + 40,
	        text: min + "        0        " + max,
	        fontSize: 15,
	        fontFamily: 'Calibri',
	        fill: 'black'
	      });    
	       YAxisNumber.setRotationDeg(-90);
	      
	    var graphGroup = new Kinetic.Group({
	      	
	      });
	      
	      graphGroup.add(YAxis);
	      graphGroup.add(XAxis);
	      graphGroup.add(XAxisText);
	      graphGroup.add(YAxisText);
	       graphGroup.add(YAxisNumber);
	      
      
      return graphGroup;
      }

      // add the layer to the stage
      stage.add(layer);
     
	}
	
}
