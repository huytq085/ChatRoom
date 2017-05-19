const express = require('express')
const path = require('path')
var app = express()
const server = require('http').Server(app)

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', './views');
app.set('views', 'ejs');
app.use('/', function(req, res, next) {
    res.send('abc');
});

server.listen(3001)