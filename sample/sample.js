const db = require("../utils/mongodb");

const User = require("../models/userModel");
const Product = require("../models/productModel");
const View = require("../models/viewModel");

// connect db
db();
//dummy data
const users = [{ name: "zamurd" }];
const products = [{ _id: "5ee35e987d7b1f0113b08e78", name: "mango" }];
let views = [
	{
		userId: "{userId}",
		ViewDate: "2020-06-01",
		ProductId: "{productId}",
	},
	{
		userId: "{userId}",
		ViewDate: "2020-06-01",
		ProductId: "{productId}",
	},
	{
		userId: "{userId}",
		ViewDate: "2020-05-29",
		ProductId: "{productId}",
	},
	{
		userId: "{userId}",
		ViewDate: "2020-05-26",
		ProductId: "{productId}",
	},
	{
		userId: "{userId}",
		ViewDate: "2020-05-26",
		ProductId: "{productId}",
	},
	{
		userId: "{userId}",
		ViewDate: "2020-05-26",
		ProductId: "{productId}",
	},
	{
		userId: "{userId}",
		ViewDate: "2020-05-25",
		ProductId: "{productId}",
	},
	{
		userId: "{userId}",
		ViewDate: "2020-05-24",
		ProductId: "{productId}",
	},
	{
		userId: "{userId}",
		ViewDate: "2020-05-20",
		ProductId: "{productId}",
	},
	{
		userId: "{userId}",
		ViewDate: "2020-04-20",
		ProductId: "{productId}",
	},
];
const importData = async () => {
	try {
		const user = await User.create(users);
		const product = await Product.create(products);
		views = views.map((item) => {
			return {
				...item,
				userId: item.userId.replace("{userId}", user[0]._id),
				ProductId: item.ProductId.replace("{productId}", product[0]._id),
			};
		});
		await View.create(views);
		console.log("data successfully loaded");
		process.exit();
	} catch (err) {
		console.log(err);
	}
};

const deleteData = async () => {
	try {
		await User.deleteMany();
		await Product.deleteMany();
		await View.deleteMany();
		console.log("data has been successfully deleted");
		process.exit();
	} catch (err) {
		console.log(err);
	}
};
console.log(process.argv);
if (process.argv[2] === "--import") {
	importData();
} else if (process.argv[2] === "--delete") {
	deleteData();
}
