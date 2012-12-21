//Run the fish population scripts
runModel = require('./batchrun.js');
var runs=[
	{	user:	"user1234",
		runId:	"run0001",
		userid: "user1234",
		runid:	"run0001",
		scriptName: 'weather_generator'
		},
	{	user:	"user1234",
		runId: 	"run0002", 
		userid: "user1234",
		runid:	"run0002",
		scriptName: 'StreamFlowModel'
		},
	{	user:	"user1234",
		runId: 	"run0003",
		userid: "user1234",
		runid:	"run0002",
		scriptName: 'StreamTemperatureModel'
		}
];
runModel.runModels(runs,0,'./Rmodel/rscripts');
