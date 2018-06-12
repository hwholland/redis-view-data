function redis(redisHost, redisPort, redisInstance) {
    this.raven = require('raven');
    this.raven.config('https://70fd4185ada74caf820ee534f4d9f1d2@sentry.io/1222649').install();
    this.client = require('redis').createClient({
        host: redisHost,
        port: redisPort
    });
    this.host = redisHost;
    this.port = redisPort;
    this.instance = redisInstance;
    this.connect(this.instance);

}

redis.prototype.connect = function(instance) {
    this.client.select(instance, function(error, response) {
        if (error) {
            return error;
        }
    });

    this.client.on("error", function(error) {
        // TODO: Replace with hook into sentry
        console.log("Error connecting to client: " + error);
    });
};

redis.prototype.subscribe = function(channel, callback) {
    this.client.on("pmessage", callback);
    this.client.psubscribe(channel);
};

redis.prototype.publish = function(channel, data) {
    this.client.publish(channel, data);
};

redis.prototype.read = function(hash, callback) {
    var that = this;
    console.log("redis read >> " + hash);
    return (new Promise((resolve, reject) => {
        that.client.hgetall(hash, callback);
    }));
};

redis.prototype.quit = function() {
    this.client.quit();
};

module.exports = redis;