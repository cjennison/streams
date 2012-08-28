
all: handlebars

handlebars: public/js/apps/app-templates.js

public/js/apps/app-templates.js: public/js/apps/weather.handlebars
	handlebars $^ -mf $@