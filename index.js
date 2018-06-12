/**
 * @module            	view-object
 * @description 		micro-service application that reads a hash from Redis based on updates published to a Redis sub/pub channel
 */
//var argv = require('minimist')(process.argv.slice(2));
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const router = require("./router");
const redis = require('./redis');
var redisHost = '127.0.0.1';
var redisPort = 6379;
var redisInstance = 0;
var redisChannel = 'view:hash:*';
var subscribeClient = new redis(redisHost, redisPort, redisInstance);
//var publishClient = new redis(redisHost, redisPort, redisInstance);

var oApp = express();
var oRouter = new router(oApp, express);

express.static.mime.default_type = "text/xml";

oApp.use(bodyParser.urlencoded({
    extended: false
}));
oRouter.setMiddleware("bodyParser", bodyParser, {
    jsonParser: bodyParser.json()
});
oRouter.loadRoutes();
oApp.listen(3002);

function fnCallback(pattern, channel, message) {
    message = JSON.parse(message);
    var publishClient = new redis(redisHost, redisPort, redisInstance);
    var aKeys = message.keys;
    var counter = 0;
    var data = [];
    var pPromise = new Promise((resolve, reject) => {
        function fnCallback(error, response) {
            counter++;
            if (error) {
                console.dir(error);
            }
            data.push(response);
            if (((typeof aKeys != "undefined") &&
                    (typeof aKeys.valueOf() == "string")) &&
                (aKeys.length > 0)) {
                resolve(data);
            } else if (counter >= aKeys.length) {
                resolve(data);
            }
        }
        if (((typeof aKeys != "undefined") &&
                (typeof aKeys.valueOf() == "string")) &&
            (aKeys.length > 0)) {
            publishClient.read(aKeys, fnCallback);
        } else {
            aKeys.forEach((item) => {
                publishClient.read(item, fnCallback);
            });
        }

    }).then(function(data) {
        publishClient.publish(message.publishTo, JSON.stringify(data));
        publishClient.quit();
    });
}

subscribeClient.subscribe(redisChannel, fnCallback);