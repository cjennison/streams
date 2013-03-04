var graphObject = []
var inputGraph = (function () {

	/**
	 * @param {Object} graph
	 * @param {Object} html
	 * @param {Object} container
	 * @param {Object} kinContainer
	 * @param {Object} type
	 * @param {Object} min
	 * @param {Object} max
	 */
    function initGraph(name, container, kinContainer, type, html, min, max, xLabel, yLabel) {
        var newgraph = {};
        newgraph.name = name;
        //console.log(newgraph);


        createGraph(newgraph, $(html), $(container), kinContainer, type, min, max, xLabel, yLabel);

        graphObject.push(newgraph);

        console.log(graphObject)

        //createGraph(name);
        
       setInterval(function(){
       	if(Streams.yearRange == null){return}
       	updateDate(Streams.yearRange);
       },100)

    }
    
    
    
    
    function updateDate(date){
    	//console.log(date);
    	var d = new Date();
    	if(date == NaN){date = 0}
    	//console.log(date)
    	for(var i=0;i<graphObject.length;i++){
    		//console.log(graphObject[i].xAxisNumber.textArr[0]);
    		graphObject[i].xAxisNumber.textArr[0] = "                              "+ d.getFullYear() +"                                                                                    " + (d.getFullYear() + date);
    		graphObject[i].stage.draw();
    	}
    	
    }
    
	/**
	 * 
	 * @param {Object} graph
	 * @param {Object} html
	 * @param {Object} container
	 * @param {Object} kinContainer
	 * @param {Object} type
	 * @param {Object} min
	 * @param {Object} max
	 */
    function createGraph(graph, html, container, kinContainer, type, min, max, xLabel, yLabel) {
        $(container).append(html);
        console.log(container);
        graph.container = container;
        graph.type = type;
		var difference_left = 3;
		var difference_right = 9;
        var stage = new Kinetic.Stage({
            container: kinContainer,
            width: 398,
            height: 100
        });

        graph.stage = stage;

        //Define the working layer
        var layer = new Kinetic.Layer();

        //Left Node
        handle = new Image();
        handle.src = "images/arrowsHandle.png";
        
         varHandle = new Image();
        varHandle.src = "images/variance_handle.png";
        
        var leftNode = new Kinetic.Image({
            x: 54,
            y: stage.getHeight() / 2,
            image: handle,
            width: 20,
            height: 40,
            offset: [10, 20],
            dragBoundFunc: function (pos) {
                var lowY = pos.y > 85 ? 85 : pos.y;
                var highY = pos.y < 15 ? 15 : pos.y;
                var newY;
                if (pos.y > 50) {
                    newY = lowY;
                } else {
                    newY = highY;
                }
                return {
                    x: this.getAbsolutePosition().x,
                    y: newY
                }
            }

        });
        graph.leftNode = leftNode;

        //Right Node
        var rightNode = new Kinetic.Image({
            x: 370,
            y: stage.getHeight() / 2,
            image: handle,
            width: 20,
            height: 40,
            offset: [10, 20],
            dragBoundFunc: function (pos) {
                var lowY = pos.y > 85 ? 85 : pos.y;
                var highY = pos.y < 15 ? 15 : pos.y;
                var newY;
                if (pos.y > 50) {
                    newY = lowY;
                } else {
                    newY = highY;
                }
                return {
                    x: this.getAbsolutePosition().x,
                    y: newY
                }
            }
        });
        graph.leftNode = rightNode;

        //Right Node
        var centerNode = new Kinetic.Image({
            x: stage.getWidth() / 2 - 90,
            y: stage.getHeight() / 2,
            image: handle,
            width: 20,
            height: 40,
            offset: [10, 20],
            dragBoundFunc: function (pos) {
                return {
                    x: this.getAbsolutePosition().x,
                    y: pos.y
                }
            }
        });
		
		
		//Variance Left Top
		var varLeftTop = new Kinetic.Image({
			x: 34,
            y: stage.getHeight() / 2 - difference_left + 10,
            image: varHandle,
            width: 20,
            height: 20,
            offset: [10, 20],
            dragBoundFunc: function (pos) {
                var lowY = pos.y > 85 ? 85 : pos.y;
                var highY = pos.y < 15 ? 15 : pos.y;
                var newY;
                if (pos.y > 50) {
                    newY = lowY;
                } else {
                    newY = highY;
                }
                return {
                    x: this.getAbsolutePosition().x,
                    y: newY
                }
            }
		})
		
		//Variance Left Top
		var varLeftBottom = new Kinetic.Image({
			x: 34,
            y: stage.getHeight() / 2 + difference_left + 10,
            image: varHandle,
            width: 20,
            height: 20,
            offset: [10, 20],
            dragBoundFunc: function (pos) {
                var lowY = pos.y > 85 ? 85 : pos.y;
                var highY = pos.y < 15 ? 15 : pos.y;
                var newY;
                if (pos.y > 50) {
                    newY = lowY;
                } else {
                    newY = highY;
                }
                return {
                    x: this.getAbsolutePosition().x,
                    y: newY
                }
            }
		});
		
		//Variance Left Top
		var varRightTop = new Kinetic.Image({
			x: 390,
            y: stage.getHeight() / 2 - difference_right + 10,
            image: varHandle,
            width: 20,
            height: 20,
            offset: [10, 20],
            
		})
		
		//Variance Left Top
		var varRightBottom = new Kinetic.Image({
			x: 390,
            y: stage.getHeight() / 2 + difference_right + 10,
            image: varHandle,
            width: 20,
            height: 20,
            offset: [10, 20],
            
		})
		
        //Central Line
        var line = new Kinetic.Line({
            points: [leftNode.getX(), leftNode.getY(), rightNode.getX(), rightNode.getY()],
            stroke: 'blue',
            strokeWidth: 2,
            lineCap: 'round',
            lineJoin: 'round',
            dragBoundFunc: function (pos) {
                return {
                    x: this.getAbsolutePosition().x,
                    y: this.getAbsolutePosition().y
                }
            }
        });

        //Variance Line
        var vline = new Kinetic.Polygon({
            points:[leftNode.getX(), leftNode.getY() - difference_left, rightNode.getX(), rightNode.getY() - difference_right, rightNode.getX(), rightNode.getY() + difference_right, leftNode.getX(), leftNode.getY() + difference_left, leftNode.getX(), leftNode.getY() - difference_left],
           // points: [leftNode.getX(), leftNode.getY() - 10, 73, 160, 340, 23, 500, 109, 499, 139, 342, 93],
        fill: 'rgba(0,0,0, .5)',
        stroke: 'none',
        strokeWidth: 1
          
        });
        
        var leftVarianceGroup = new Kinetic.Group({
        	dragBoundFunc: function (pos) {
                var lowY = pos.y > 45 ? 45 : pos.y;
                var highY = pos.y < -45 ? -45 : pos.y;
                var newY;
                if (pos.y > 45) {
                    newY = lowY;
                } else {
                    newY = highY;
                }
                return {
                    x: this.getAbsolutePosition().x,
                    y: this.getAbsolutePosition().x,
                }
            }
            
        })
        
        var rightVarianceGroup = new Kinetic.Group({
        	dragBoundFunc: function (pos) {
                var lowY = pos.y > 45 ? 45 : pos.y;
                var highY = pos.y < -45 ? -45 : pos.y;
                var newY;
                if (pos.y > 45) {
                    newY = lowY;
                } else {
                    newY = highY;
                }
                return {
                    x: this.getAbsolutePosition().x,
                    y: this.getAbsolutePosition().x,
                }
            }
            
        })

        rightNode.setDraggable(true);
        leftNode.setDraggable(true);
        
        
         leftVarianceGroup.setDraggable(true);
         rightVarianceGroup.setDraggable(true);
         
          
		layer.add(drawGraph());
      if(type == "variation"){ layer.add(vline); };
        layer.add(line);
        layer.add(leftNode);
        layer.add(rightNode);
        if(type == "variation"){
        	
        	leftVarianceGroup.add(varLeftTop);
	        leftVarianceGroup.add(varLeftBottom);
	        layer.add(leftVarianceGroup);
	        rightVarianceGroup.add(varRightBottom);
	        rightVarianceGroup.add(varRightTop);
	        layer.add(rightVarianceGroup);
        }
       
      //  layer.add(drawGraph());
        stage.add(layer);
        
        var lastLeftY = 0;
        var lastRightY = 0;
        
        rightVarianceGroup.on('dragmove', function(ev){
			if(lastRightY > ev.clientY){
				console.log("LESSER")
				if(difference_right <= 20){
					difference_right++;
				} else {
					difference_right = 20;
				}
			} else {
				console.log("GREATER")
				if(difference_right >= 0){
					difference_right--;
				} else {
					difference_right = 0;
				}
			}
			updateLine([leftNode.getX(), leftNode.getY(), rightNode.getX(), rightNode.getY()]);

			stage.draw();
			lastRightY = ev.clientY
        });
        
        
        leftVarianceGroup.on('dragmove', function(ev){
			if(lastLeftY > ev.clientY){
				console.log("LESSER")
				if(difference_left <= 20){
					difference_left++;
				} else {
					difference_left = 20;
				}
			} else {
				console.log("GREATER")
				if(difference_left >= 0){
					difference_left--;
				} else {
					difference_left = 0;
				}
			}
			updateLine([leftNode.getX(), leftNode.getY(), rightNode.getX(), rightNode.getY()]);

			stage.draw();
			lastLeftY = ev.clientY
        });
        
        rightNode.on('dragstart', function() {
	      	//resizing = false;
	      	updateLine([leftNode.getX(), leftNode.getY(), rightNode.getX(), rightNode.getY()]);
	      });
	      rightNode.on('dragmove', function() {
	      	updateLine([leftNode.getX(), leftNode.getY(), rightNode.getX(), rightNode.getY()]);
	      });
	      rightNode.on('dragend', function() {
	      	updateLine([leftNode.getX(), leftNode.getY(), rightNode.getX(), rightNode.getY()]);
	      });
	      
	      leftNode.on('dragstart', function() {
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
	      	vline.setPoints([leftNode.getX(), leftNode.getY() - difference_left, rightNode.getX(), rightNode.getY() - difference_right, rightNode.getX(), rightNode.getY() + difference_right, leftNode.getX(), leftNode.getY() + difference_left, leftNode.getX(), leftNode.getY() - difference_left]);
			varLeftTop.setY(leftNode.getY() - difference_left + 10);
			varLeftBottom.setY(leftNode.getY() + difference_left + 10);
			varRightTop.setY(rightNode.getY() - difference_right + 10);
			varRightBottom.setY(rightNode.getY() + difference_right + 10);
			
	      	var changeInY = Math.round((rightNode.getY() - 50)/min/1.5);
      		var changeInY_Left = Math.round((leftNode.getY() - 50)/min/1.5);
	      	
	      	if(type == "no_variation"){
	      		changeInY = Math.round(((rightNode.getY() - 50)/min)*6.5);
      	 	changeInY_Left = Math.round(((leftNode.getY() - 50)/min)*6.5);
	      	}
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
      	 	$(container).find('.endNumber').val(changeInY);
      	 	$(container).find('.startNumber').val(changeInY_Left);
	      	
	      	if(type == "variation"){
	      		$(container).find('.varendNumber').val(difference_right);
      	 		$(container).find('.varstartNumber').val(difference_left);
	      	}
	      	graph.startMeanVal = $(container).find('.startNumber').val();
	        graph.endMeanVal = $(container).find('.endNumber').val();
	        if(type == "variation"){
	        	 graph.startVarVal = $(container).find('.varstartNumber').val();
	       		 graph.endVarVal = $(container).find('.varendNumber').val();
	        }
	      	
	      	stage.draw();
	      	
        }
        
        
        graph.startMeanVal = $(container).find('.startNumber').val();
        graph.endMeanVal = $(container).find('.endNumber').val();
        if(type == "variation"){
        	 graph.startVarVal = $(container).find('.varstartNumber').val();
       		 graph.endVarVal = $(container).find('.varendNumber').val();
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
	        x: stage.getWidth() / 2 - 100,
	        y: stage.getHeight()/2 + 30,
	        text: xLabel,
	        fontSize: 13,
	        fontFamily: 'Calibri',
	        fill: 'black'
	      });
	      
	      var XAxisNumber = new Kinetic.Text({
	        x: stage.getWidth() / 2 - 240,
	        y: stage.getHeight()/2 + 20,
	        text: "                              2013                                                                                    2043",
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
	       graphGroup.add(XAxisNumber);
	       
	      graph.xAxisNumber = XAxisNumber;
      
      
      
      
      return graphGroup;
      }
		
		setInterval(function(){
			stage.draw();
		},1000)
        
    }
    
    
    

    return {
        initGraph: initGraph,
        updateDate:updateDate,
    }
})();