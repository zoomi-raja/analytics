const mongoose = require("mongoose");
// scehema
const porductSchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, "A product must have a name"],
	},
});
module.exports = mongoose.model("Product", porductSchema);
