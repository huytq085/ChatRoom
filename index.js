var express = require('express');
var app = express();
app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.set('views', './views');

var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(3001);



io.on('connection', function(socket) {
    console.log('Co nguoi ket noi ' + socket.id);
    socket.on('disconnect', function(){
        console.log(`${socket.id} vua ngat ket noi`)
    })
    socket.on('client-send-data', function(data){
        console.log(`Client says ${data}`)
        socket.emit('server-send-data', data+'123')
    })
    

});

app.get('/', function(req, res) {
    res.render('index');
});