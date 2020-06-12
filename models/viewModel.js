const mongoose = require("mongoose");
// scehema
const viewSchema = mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: [true, "View must belong to user"],
	},
	ViewDate: {
		type: Date,
		default: Date.now(),
	},
	ProductId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Product",
		required: [true, "View must belong to Product"],
	},
});

viewSchema.index({ ViewDate: 1 });

viewSchema.statics.analytics = async function (
	$by = "month",
	$year = 2020,
	$productId = "5ee35e987d7b1f0113b08e78"
) {
	if ($by === undefined || $by === null) return [];
	const year = $year * 1;
	let groupClause = {};
	let addField = {};
	switch ($by) {
		case "week":
			groupClause = {
				$group: {
					_id: { $week: "$ViewDate" },
					views: { $sum: 1 },
					users: { $addToSet: { user: "$userId", product: "$ProductId" } },
				},
			};
			addField = {
				$addFields: {
					[$by]: "$_id",
				},
			};
			break;
		case "day":
			groupClause = {
				$group: {
					_id: {
						day: { $dayOfMonth: "$ViewDate" },
						month: { $month: "$ViewDate" },
						year: { $year: "$ViewDate" },
					},
					views: { $sum: 1 },
					users: { $addToSet: { user: "$userId", product: "$ProductId" } },
				},
			};
			addField = {
				$addFields: {
					[$by]: "$_id",
				},
			};
			break;
		default:
			groupClause = {
				$group: {
					_id: { day: { $month: "$ViewDate" } },
					views: { $sum: 1 },
					users: { $addToSet: { user: "$userId", product: "$ProductId" } },
				},
			};
			addField = {
				$addFields: {
					[$by]: "$_id",
				},
			};
			break;
	}
	const analytics = await this.aggregate([
		{
			$match: {
				$and: [
					{
						ProductId: mongoose.Types.ObjectId($productId),
					},
					{
						ViewDate: {
							$gte: new Date(`${year}-01-01`),
							$lte: new Date(`${year}-12-31`),
						},
					},
				],
			},
		},
		groupClause,
		addField,
		{
			$project: {
				_id: 0,
			},
		},
	]);
	return analytics;
};

module.exports = mongoose.model("UserView", viewSchema);
