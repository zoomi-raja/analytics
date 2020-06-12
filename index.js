const http = require("http");
const db = require("./utils/mongodb");
//connect db
db();
const viewController = require("./controllers/viewController");
http.createServer(viewController).listen(8000);
