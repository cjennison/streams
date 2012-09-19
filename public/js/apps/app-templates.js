(function(){var a=Handlebars.template,b=Handlebars.templates=Handlebars.templates||{};b.weather=a(function(a,b,c,d,e){return c=c||a.helpers,'<div id="weather-models-app">\n  <div id="loader">\n    <div id="message"></div>\n  </div>\n  <select name="weathertype" class="ui-state-default"><option>Stochastic Weather Generation</option>\n    <option disabled="disabled">Downscaled Climate Scenario</option></select>\n  <p><strong>Specify Amount Change</strong>\n    <br>Please select values below for changes driving stochastically generated weather.\n  </p>\n  <p>\n    \n    <p>Mean Annual Precipitation (% change, 80-year mean) [<span id="precip01-value"></span>%]</p>\n    <div id="precip01"></div>\n    \n    <p>Precipitation Annual Variance (% change, 80-year mean) [<span id="precip02-value"></span>%]</p>\n    <div id="precip02"></div>\n\n    <p>Mean Annual Temperature (&deg;C change, 80-year mean) [<span id="mean-temp-value"></span>]</p>\n    <div id="mean-temp"></div>\n  </p>\n  <p>\n    <a id="run" href="#">Run Model</a>\n  </p>\n</div>\n'})})()