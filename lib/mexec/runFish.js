//Run the fish population scripts
runModel = require('./batchrun.js');
var runs=[
	{	user:	"user1234",
		userid: "user1234",
		runid:	"run0001",
		scriptName: 'testR'
		},
	{	user:	"user1234",
		userid: "user1234",
		runid:	"run0002",
		scriptName: 'StreamFlowModel'
		},
	{	user:	"user1234",
		userid: "user1234",
		runid:	"run0002",
		scriptName: 'StreamTemperatureModel'
		}
];
runModel.runModels(runs,0,'.');