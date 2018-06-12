
function pubsub() {
    const path = require('path');
    const redis = require('../redis');
    const uuid = require('uuid/v1');

    var redisHost = '127.0.0.1';
    var redisPort = 6379;
    var redisInstance = 0;
    var redisChannel = 'view:hash:data';
    var uId = uuid();
    var data = {
        publishTo: uId,
        keys: ['business:action', 'business:object', 'business:process']
    }

    var subscribeClient = new redis(redisHost, redisPort, redisInstance);
    var publishClient = new redis(redisHost, redisPort, redisInstance);

    function callback(pattern, channel, message) {
        console.log("------------------");
        console.log("pub/sub: ");
        console.log("channel: " + channel);
        console.log("message: " + message);
    }

    subscribeClient.subscribe(uId, callback);
    publishClient.publish(redisChannel, JSON.stringify(data));
}

function request() {
    var http = require('http');
    http.post = require('http-post');
    http.post('http://127.0.0.1:3002/read/hash', {
        keys: ['business']
    }, function(response) {
        response.setEncoding('utf8');
        response.on('data', function(chunk) {
            console.log("request/response: " + chunk);
            pubsub();
        });
    });
}

request();