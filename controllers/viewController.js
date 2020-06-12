const url = require("url");
const ViewModel = require("../models/viewModel");
const viewController = async (req, res) => {
	const queryObject = url.parse(req.url, true).query;
	let by = queryObject.by ? queryObject.by : undefined;
	let year = queryObject.year ? queryObject.year : undefined;

	const data = await ViewModel.analytics(by, year);
	res.writeHead(200, { "Content-Type": "application/json" });
	res.write(JSON.stringify(data));
	res.end();
};

module.exports = viewController;
