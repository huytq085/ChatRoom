var socket = io('http://localhost:3001')
socket.on('server-send-thatbai', function (data) {
    alert(`${data} có người sử dụng rồi`)
})
socket.on('server-send-thanhcong', function (data) {
    $(".loginForm").hide('2000');
    $(".chatForm").show('1000');
    $("#currentUser").append(`<span style="font-weight: 700;">${data}</span>`)
    //  $('#listUsers').append(data)
})
socket.on('server-send-thanhcong-moinguoi', function (data) {
    // var $newdiv1 = $( "<p></p>" ),

    $('#listUsers').html("")

    data.forEach(function (i) {
        $('#listUsers').append(`<div class="users">${i}</div>`)
    })
})
socket.on('server-send-message', function (data) {
    $("#listMessages").append(`<div class="listMessages"><span style="font-weight:700">${data.username}</span>: ${data.message}</div>`)
})
$(document).ready(function () {
    $(".loginForm").show();
    // alert('avc')
    $("#btnRegister").click(function () {
        socket.emit('Client-send-reg', $("#txtUserName").val());
    })
    $("#btnLogout").click(function () {
        socket.emit('logout');
        $(".chatForm").hide('1000');
        $(".loginForm").show('2000');

    })
    $("#btnSendMessage").click(function () {
        socket.emit('user-send-message', $('#txtMessage').val());
    })
    $('#txtMessage').keydown(function (event) {
        var keypressed = event.keyCode || event.which;
        if (keypressed == 13) {
            socket.emit('user-send-message', $('#txtMessage').val());
            $('#txtMessage').val('')
        }
    });
    $('#txtUserName').keydown(function (event) {
        var keypressed = event.keyCode || event.which;
        if (keypressed == 13) {
            socket.emit('Client-send-reg', $("#txtUserName").val());
        }
    });
})