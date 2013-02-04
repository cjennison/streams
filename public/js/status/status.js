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
	}
	

};