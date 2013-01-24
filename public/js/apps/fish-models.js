Streams.app_control.apps.fish_models = {
  name : 'Fish Population Models',
  order: 5,
  init : function () {
    // Nothing in context yet!
    var context = { };
    var template = Handlebars.templates['fish-models'];
    var view=$('#fish-models-app');
    $(view).addClass("application");
    
    var model = $('div#fish-models-app.application .styledSelect select');

    
    var stockingslider1 = view.find('.stockingslider1');
    var stockingNumber = view.find('.stockingNumber');
    var countslider1 = view.find('.countslider1');
    var countNumber = view.find('.countNumber');
    
    var runbutton = view.find('#run');
    
    runbutton.button({disabled:false});
    
    
    countslider1.slider({
      		max    : 100,
	        min     : 0,
	        range   : 'min',
	        value   : 50,
	        animate : 'fast',
     		 disabled:false,
     		 slide   : function (event, ui) {
     		 	countNumber.text(ui.value);
     		 }
    });
    
    stockingslider1.slider({
      		max    : 100,
	        min     : 0,
	        range   : 'min',
	        value   : 50,
	        animate : 'fast',
     		 disabled:false,
     		 slide   : function (event, ui) {
     		 	stockingNumber.text(ui.value);
     		 }
    });
    
    
    
    model.change(function(){
		console.log($(this).val())
		console.log($('div#fish-models-app.application ' + '#' + $(this).val()));
		
		console.log($('div#fish-models-app.application .app_content .app'));
		var appContent = $('div#wfish-models-app.application .app_content .app');
		for(var i=0;i<appContent.length;i++){
			if($(appContent[i]).hasClass("active")){
				$(appContent[i]).removeClass("active")
			}
		}
		
		$('div#fish-models-app.application ' + '#' + $(this).val()).addClass("active")
	})
    
    
    this.view = view;

  }
};
