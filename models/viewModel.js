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
	let groupClause2 = {};
	switch ($by) {
		case "week":
			groupClause = {
				week: { $week: "$ViewDate" },
			};
			groupClause2 = {
				[$by]: "$_id.week",
			};
			break;
		case "day":
			groupClause = {
				day: { $dayOfMonth: "$ViewDate" },
				month: { $month: "$ViewDate" },
				year: { $year: "$ViewDate" },
			};
			groupClause2 = {
				day: "$_id.day",
				month: "$_id.month",
				year: "$_id.year",
			};
			break;
		default:
			groupClause = {
				month: { $month: "$ViewDate" },
			};
			groupClause2 = {
				month: "$_id.month",
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
		{
			$group: {
				_id: {
					...groupClause,
					users: { user: "$userId", product: "$ProductId" },
				},
				views: { $sum: 1 },
			},
		},
		{
			$group: {
				_id: {
					...groupClause2,
				},
				totalViews: { $sum: "$views" },
				distinctViews: { $sum: 1 },
			},
		},
		{
			$addFields: {
				info: "$_id",
			},
		},
		{
			$project: {
				_id: 0,
			},
		},
	]);
	return analytics;
};

module.exports = mongoose.model("UserView", viewSchema);
