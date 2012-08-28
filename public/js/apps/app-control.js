/* The AppControl module
 */
var AppControl;

$(function () {
  // The AppControl object:
  var exp = { name : 'AppControl' };
  
  // First construct the main AppControl UI element:
  exp.elm = $('<div id="app-control">');
  
  // Create the accordion:
  var accordion = $('<div>');
  
  // Accordion options:
  var accordionOpts = {
    header    : 'h3',
    fillSpace : true
  };

  // Apply some jQuery UI properties:
  accordion.accordion(accordionOpts);

  // Attach to UI:
  exp.elm.append(accordion);

  // Append to the body element:
  $('body').append(exp.elm);
  
  // Make the element resiable and draggable:
  exp.elm.draggable();

  exp.addApp = function (app) {
    accordion.append(app);
    // Reconstruct the accordion:
    accordion.accordion('destroy');
    accordion.accordion(accordionOpts)
  };

  // A test to dynamically add an element to the accordion:
  exp.addApp($('<h3><a href="#">Hello</a></h3><div><p>This is a test</p></div>'));
  exp.addApp($('<h3><a href="#">Hello 2</a></h3><div><p>This is a test</p></div>'));  
  
  AppControl = exp;
});