var models = {
	weather_generator: {
		idx: 0,
		dependency: ["basin"],
		param: ["basinid"]
	},
	streamFlowModel: {
		idx: 1,
		dependency: ["weather_generator"],
		param: []
	}
	streamTempertuareModel
}