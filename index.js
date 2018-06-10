/**
 * @module            	view-object
 * @description 		micro-service application that reads a hash from Redis based on updates published to a Redis sub/pub channel
 */

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const router = require("./router");

var oApp = express();
var oRouter = new router(oApp, express);

express.static.mime.default_type = "text/xml";

oApp.use(bodyParser.urlencoded({extended: false}));
oRouter.setMiddleware("bodyParser", bodyParser, {jsonParser: bodyParser.json()});
oRouter.loadRoutes();
oApp.listen(3000);

