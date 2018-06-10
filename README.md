# redis-view-data
Utility that adds reads an array of objects from a Redis database.  It processes HTTP POST requests which provide an array of keys.  Each of these key values should correspond to a hash object's key in the database.  Once all hash objects have been retrieved, an array of objects is sent back to the requester.

## Technical Summary
[tbd]

## Usage

### Prerequisites
* Node.js must be installed on the host computer.
* Redis database is available, with credentials to connect and subscribe to a pub/sub channel.

### Installing
Download the package to the host computer (desktop or server), then navigate
to the project's directory on the filesystem using a command-prompt or terminal.

```
~/view-data
```

Run the following command to install the node.js dependency modules.

```
npm install
```
### Starting
Start the application from the command-prompt or terminal in the project's directory, using the following command.

```
node index.js --redisHost 127.0.0.1 --redisPort 6379 --redisInstance 0
```

Take note to change these parameters with the correct values:
* redisHost
* redisPort
* redisInstance


### Testing
With the application running, execute the test script from the project's home directory (where package.json is located).

```
npm run test
```
## Built With

* [Node.js](https://nodejs.org) - Server-side JavaScript engine
* [Redis](https://redis.io) - Redis is an open source (BSD licensed), in-memory data structure store, used as a database, cache and message broker. 

## Authors

* **Harrison Holland** - *Development* - [hwholland](https://github.com/hwholland)
