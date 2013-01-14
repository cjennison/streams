Streams.graphs = {
	
	
	
	init:function(container, graphState){

		this.setupGraph(container, graphState);

	},
	
	
	
	setupGraph:function(container, state){
		 var stage = new Kinetic.Stage({
        container: container,
        width: 578,
        height: 100
      });

      var layer = new Kinetic.Layer();

      var leftNode = new Kinetic.Circle({
        x: 40,
        y: stage.getHeight() / 2,
        radius: 10,
        fill: 'orange',
        
      });
      
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
      
      var bg = new Kinetic.Rect({
      	x:0,
      	y:0,
      	width: 578,
      	height: stage.getWidth(),
      	fill:'white',
      });
       
       //Draw
       var graphImageObj = new Image();
       graphImageObj.onload = function() {
		stage.draw();
      }
      graphImageObj.src = 'images/graphbg.png';
      

     
     
     var graphImage = new Kinetic.Image({
	      	 x: 0,
	          y: stage.getHeight() / 2 - 59,
	          image: graphImageObj,
	          width: 400,
	          height: 118
	      });

      var group = new Kinetic.Group({
      	dragBoundFunc: function(pos) {
          return {
            x: this.getAbsolutePosition().x,
            y: pos.y
          }
        }
      });
      if(state == "mean_var"){
      	 group.add(vline);
      	 console.log("ADDED LINE")
      }
      
	  group.add(line);
      
      group.add(leftNode);
      group.add(rightNode);
      // add the shape to the layer
      layer.add(bg);
     layer.add(graphImage);
      
      

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

      // add the layer to the stage
      stage.add(layer);
     
	}
	
}
