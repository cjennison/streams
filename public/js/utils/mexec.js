Streams.Mexec = {
	name : 'Mexec',
	
	dataObject:{
		testdata:null,
	},
	
	/**
	 * 
 * @param {Object} options All params
	 */
	fillDataObject:function(){
		this.Data({test:"Onions"
		
								});
		
		console.log(this.dataObject);
		
	},
	
	Data:function(options){
		var data = this.dataObject;
		data.test = options.test || undefined;
	}
	
};
