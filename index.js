var express = require('express');
var app = express();
app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.set('views', './views');

var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(3001);
console.log("localhost:3001")
var usersList = []
var usersList1 = []
io.on('connection', function (socket) {
    console.log('Co nguoi ket noi ' + socket.id);
    socket.on('disconnect', function () {
        console.log(`${socket.id} vua ngat ket noi`)
    })
    socket.on('Client-send-reg', function (data) {
        // console.log(`Client says ${data}`)
        socket.userName = data

        if (usersList.indexOf(socket.userName) >= 0) {

            socket.emit('server-send-thatbai', data)
        } else {
            usersList.push(data)
            socket.emit('server-send-thanhcong', data)
            io.sockets.emit('server-send-thanhcong-moinguoi', usersList)
            
        }
        socket.on('logout', function(){
            // console.log(usersList.indexOf(socket.userName))
            if (usersList.indexOf(socket.userName)>=0){
            usersList.splice(usersList.indexOf(socket.userName), 1);
            socket.broadcast.emit('server-send-thanhcong-moinguoi', usersList)
                
            }
        })
        socket.on('user-send-message', function(data){
            io.sockets.emit('server-send-message', {"username": socket.userName, "message": data})
            console.log(data)
        })
        
    })


});

app.get('/', function (req, res) {
    res.render('index');
    // res.send('abc');
});