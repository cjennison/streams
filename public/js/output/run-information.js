Output.runInformation = {
	
	
	parseResponse:function(response){
		//console.log(response + ": Object");
		var jsonObject = JSON && JSON.parse(response) || $.parseJSON(response);
		//console.log(jsonObject);
		
		return jsonObject;
	}
	
	
	
	
	
}
