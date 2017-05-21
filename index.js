var express = require('express');
var app = express();
app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.set('views', './views');

var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(4000);
console.log("localhost:4000")
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

        if (usersList.indexOf(data) >= 0) {

            socket.emit('server-send-thatbai', data)
        } else {
            usersList.push(data)
            console.log(data)
            socket.emit('server-send-thanhcong', data)
            io.sockets.emit('server-send-thanhcong-moinguoi', usersList)

        }
        socket.on('logout', function () {
            // console.log(usersList.indexOf(socket.userName))
            if (usersList.indexOf(socket.userName) >= 0) {
                usersList.splice(usersList.indexOf(socket.userName), 1);
                socket.broadcast.emit('server-send-thanhcong-moinguoi', usersList)
                socket.emit('server-logout')
            }
            socket.emit('server-logout')
        })
        //Server nhan tin nhan duoc ma hoa
        socket.on('user-send-message', function (data) {
            console.log("user-send-message" + data)
            io.sockets.emit('server-send-message', { "id": socket.id, "username": socket.userName, "message": data })
            console.log(data)
        })
        socket.on('user-send-message-noencrypt', function (data) {
            console.log("user-send-message-noencrypt" + data)
            io.sockets.emit('server-send-message-noencrypt', { "id": socket.id, "username": socket.userName, "message": data })
            console.log(data)
        })
        socket.on('dang-go-phim', function(){
            socket.broadcast.emit('co-nguoi-go-phim', socket.userName)
        })
        socket.on('ngung-go-phim', function(){
            socket.broadcast.emit('khong-con-go-phim')
        })
        

    })


});

app.get('/', function (req, res) {
    res.render('index');
    // res.send('abc');
});