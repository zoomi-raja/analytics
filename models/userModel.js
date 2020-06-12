const mongoose = require("mongoose");
// scehema
const userSchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, "A user must have a name"],
	},
});
module.exports = mongoose.model("User", userSchema);
