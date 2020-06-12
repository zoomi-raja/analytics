const mongoose = require("mongoose");
const mongodb = () => {
	try {
		const dbCon = "mongodb://mongo:27017/assignment";
		mongoose.connect(dbCon, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			autoIndex: true,
		});
	} catch (error) {
		console.log(error);
	}
};
module.exports = mongodb;
