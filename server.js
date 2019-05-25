// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const reload = require('reload');
const watch = require('watch');
const http  = require('http')
// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
    response.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)

var server = http.createServer(app)
reload(app).then(function(reloadReturned) {
    const listener = server.listen(3000, function() {
        console.log('Your app is listening on port ' + listener.address().port)
    })


    watch.watchTree(__dirname + "/public", function(f, curr, prev) {
        // Fire server-side reload event
        console.log("reloaded due to " + JSON.stringify(f))
        reloadReturned.reload();
    });
}).catch (function(err) {
    console.error('Reload could not start, could not start server/sample app', err)
})
