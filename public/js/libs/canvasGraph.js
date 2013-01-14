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
    handle = new Image();
    handle.src = "images/graphHandle.png";
      var leftNode = new Kinetic.Image({
        x: 44,
        y: stage.getHeight() / 2,
        image:handle,
        width:20,
        height:40,
        offset:[0, 18],
        dragBoundFunc: function(pos) {
          return {
            x: this.getAbsolutePosition().x,
            y: pos.y
          }
        }
        
      });
     //Right Node
      var rightNode = new Kinetic.Image({
        x: 380,
        y: stage.getHeight() / 2,
         image:handle,
        width:20,
        height:40,
        offset:[20, 18],
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
      	stroke: 'blue',
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
      
      arrow = new Image();
    arrow.src = "images/arrowsHandle.png";
      var leftArrow = new Kinetic.Image({
      	x: 50,
        y: stage.getHeight() / 2,
         image:arrow,
        width:20,
        height:40,
        offset:[20, 18],
       
      })
      var rightArrow = new Kinetic.Image({
      	x: 400,
        y: stage.getHeight() / 2,
         image:arrow,
        width:20,
        height:40,
        offset:[20, 18],
       
      })
      
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
       group.add(leftNode);
      if(state == "mean_var"){
      	 group.add(vline);
      	 vline.setOpacity(.5);
      }
     
	  group.add(line);
     
      group.add(rightNode);
      group.add(leftArrow);
       group.add(rightArrow);
      //Add Elements to Layer
      layer.add(bg);
      layer.add(drawGraph());
      layer.add(group);
      
      var startingY = 0;
      var mouseY = 0;
      var resizing = false;
      
      
      
      setInterval(function(){
      	stage.draw();
      }, 1000);
      
    	
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
		leftNode.setDraggable(true);
		
      rightNode.on('dragstart', function() {
      		resizing = false;
      	updateLine([leftNode.getX(), leftNode.getY(), rightNode.getX(), rightNode.getY()]);
      });
      rightNode.on('dragmove', function() {
      	updateLine([leftNode.getX(), leftNode.getY(), rightNode.getX(), rightNode.getY()]);
      });
      rightNode.on('dragend', function() {
      	updateLine([leftNode.getX(), leftNode.getY(), rightNode.getX(), rightNode.getY()]);
      });
      
      leftNode.on('dragstart', function() {
      		resizing = false;
      	updateLine([leftNode.getX(), leftNode.getY(), rightNode.getX(), rightNode.getY()]);
      });
      leftNode.on('dragmove', function() {
      	updateLine([leftNode.getX(), leftNode.getY(), rightNode.getX(), rightNode.getY()]);
      });
      leftNode.on('dragend', function() {
      	updateLine([leftNode.getX(), leftNode.getY(), rightNode.getX(), rightNode.getY()]);
      });
      
      function updateLine(points){
      	line.setPoints(points);
      	vline.setPoints(points);
      	leftNode.setRotation(-1*(leftNode.getY()-50)/250);
      	rightNode.setRotation(1*(rightNode.getY()-50)/250);
      	leftArrow.setY(leftNode.getY());
      	rightArrow.setY(rightNode.getY());
      	
      	var changeInY = Math.round((rightNode.getY() - 50)/min/2);
      	var changeInY_Left = Math.round((leftNode.getY() - 50)/min/2);
      	 if(state == "mean_var"){
      	 	changeInY = Math.round((rightNode.getY() - 50)/min/2);
      	 	if(changeInY > max){
      	 		changeInY = max;
      	 	} else if(changeInY < min) {
      	 		changeInY = min;
      	 	}
      	 	 Streams.app_control.apps.weather_models.updateText('#mean_1', changeInY_Left);
      		Streams.app_control.apps.weather_models.updateText('#mean_2', changeInY);
      	 } else  if(state == "temp"){
      	 	changeInY = Math.round(((rightNode.getY() - 50)/min)*4.75);
      	 	changeInY_Left = Math.round(((leftNode.getY() - 50)/min)*4.75);
      	 	if(changeInY > max){
      	 		changeInY = max;
      	 	} else if(changeInY < min) {
      	 		changeInY = min;
      	 	}
      	 	
      	 	if(changeInY_Left > max){
      	 		changeInY_Left = max;
      	 	} else if(changeInY_Left < min) {
      	 		changeInY_Left = min;
      	 	}
      	 	Streams.app_control.apps.weather_models.updateText('#mean_temp_2', changeInY);
			Streams.app_control.apps.weather_models.updateText('#mean_temp_1', changeInY_Left);

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
