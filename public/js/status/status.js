var Status = {

	init:function(){
		console.log("INIT STATUS");
		
		$("#statusBar #statusButton").bind('click', function(){
			if($("#statusBar").attr("state") == "closed"){
				$("#statusBar").addClass("active");
				$("#statusBar").attr("state", "open");
				
				$(this).bind('mouseout', function(){
					setTimeout(function(){
						$("#statusBar").removeClass("active");
						$("#statusBar").attr("state", "closed");
					}, 4000)
				})
			} else {
				$("#statusBar").removeClass("active");
				$("#statusBar").attr("state", "closed");
			}
		});
	},
	
	addQueue:function(queueObject){
		var queueList = $("#statusBar ul");
		var listItem = $("<li></li>");
		console.log(queueObject)
		var name = $("<span class='runtitle'>" + queueObject.run_alias + "</span>")
		var status = $("<span class='status'>Processing..</span>")
		$(listItem).append(status);
				$(listItem).append(name);

		$(queueList).append(listItem);
		
		if($("#statusBar").attr("state") == "closed"){
				$("#statusBar").addClass("active");
				$("#statusBar").attr("state", "open");
				
				setTimeout(function(){
						$("#statusBar").removeClass("active");
						$("#statusBar").attr("state", "closed");
					}, 4000)
			}
	}
	

};