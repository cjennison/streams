/* The AppControl module
 */
Streams.app_control = {
  name : 'AppControl',
  apps : { },
  
  init : function () {
    this.view = $('<div id="app-control">');
  },

  render : function () {
    // Create the accordion:
    var accordion = $('<div>');
    
    // Create an array of the apps:
    var apps = [];
    for (var name in this.apps) {
      apps.push(this.apps[name]);
    }

    // Sort the apps by order property:
    apps.sort(function (x, y) {
      return x.order > y.order;
    });

    // Add the registered apps:
    console.log('Loading Apps:');
    for (var i = 0; i < apps.length; i++) {
      var app = apps[i];
      
      console.log('    ' + app.name);
      // Initialize the app:
      app.init();
      // Add to the app control view:
      var header  = $('<h3><a href="#">' + app.name + '</a></h3>');
      accordion.append(header);
      accordion.append(app.view);
    }
    
    // Append the accordion:
    this.view.append(accordion);
    
    // Append to the body element:
    $('body').append(this.view);
    // Make the element resiable and draggable:
    Streams.app_control.view.draggable();

    // Accordion options:
    var accordionOpts = {
      header    : 'h3',
      fillSpace : true
    };

    // Apply some jQuery UI properties:
    accordion.accordion(accordionOpts);
  }
};
