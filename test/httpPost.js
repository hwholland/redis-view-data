var http = require('http');
http.post = require('http-post');
http.post('http://127.0.0.1:3000/view', {
    keys: ['company:1', 'company:2']
}, function(response) {
    response.setEncoding('utf8');
    response.on('data', function(chunk) {
        console.log(chunk);
    });
});