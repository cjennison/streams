var Worker = require('webworker-threads').Worker;

var worker = new Worker(function () {
	postMessage("before postMessage('all')");
	onmessage = function (event) {
		postMessage('Hi ' + event.data);
		self.close();
	};
});

worker.onmessage = function (event) {
	console.log('Worker said : ' + event.data);
};

worker.postMessage('ALL');