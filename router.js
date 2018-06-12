const redis = require('./redis');
//var argv = require('minimist')(process.argv.slice(2));

function router(oApp, oExpress) {
    'use strict';
    this.router = oExpress.Router();
    this.app = oApp;
    this.app.use(this.router);
    /*
    this.redisHost = argv.redisHost;
    this.redisPort = argv.redisPort;
    this.redisInstance = argv.redisInstance;
    */
    this.redisHost = '127.0.0.1';
    this.redisPort = 6379;
    this.redisInstance = 0;
}

router.prototype.loadRoutes = function() {
    'use strict';
    var that = this;

    this.app.post("/read/hash", this.jsonParser, function(oRequest, oResponse) {
        var redisClient = new redis(that.redisHost, that.redisPort, that.redisInstance);
        var aKeys = oRequest.body.keys;
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
                }
                else if (counter >= aKeys.length) {
                    resolve(data);
                }
            }
            if (((typeof aKeys != "undefined") &&
                    (typeof aKeys.valueOf() == "string")) &&
                (aKeys.length > 0)) {
                redisClient.read(aKeys, fnCallback);
            } else {
                aKeys.forEach((item) => {
                    redisClient.read(item, fnCallback);
                });
            }

        }).then(function(data) {
            oResponse.send(data);
        });
    });
};

router.prototype.setMiddleware = function(sName, oMiddleware, mSettings) {
    'use strict';
    this[sName] = oMiddleware;
    var oProperties = Object.getOwnPropertyNames(mSettings);
    for (var i = 0; i < oProperties.length; i++) {
        this[oProperties[i]] = mSettings[oProperties[i]];
    }
};

module.exports = router;