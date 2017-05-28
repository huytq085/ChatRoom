var socket = io('http://localhost:4000')
var privateKey = ""
socket.on('server-send-key', function(data){
    privateKey = data
    
})
socket.on('server-send-thatbai', function (data) {
    $('.form-inline').addClass('has-error');
    $("#registerResult").html(`<b>${data}</b> already registered`)
})
socket.on('server-send-thanhcong', function (data) {
    $(".loginForm").hide('2000');
    $(".chatForm").show('1000');
    $('.form-inline').removeClass('has-error');
    $("#currentUser").append(`<span style="font-weight: 700;">${data}</span>`)
    //  $('#listUsers').append(data)
})
socket.on('server-logout', function () {

    $("#currentUser").html('')
    $("#listMessages").html('')

})
socket.on('server-send-thanhcong-moinguoi', function (data) {
    // var $newdiv1 = $( "<p></p>" ),

    $('#listUsers').html("")

    data.forEach(function (i) {
        $('#listUsers').append(`<a href="#" class="list-group-item">${i}</a>`)
    })
})
//Nguoi dung nhan tin nhan da duoc giai ma
socket.on('server-send-message', function (data) {
    //Giai ma tin nhan truoc khi gui
    var decrypted = CryptoJS.AES.decrypt(data.message, privateKey);
    if (data.id == socket.id) myMessage = 'myRight'; else myMessage = '';
    $("#listMessages").append(`<div class="messages ${myMessage}"><span style="font-weight:700">${data.username}</span>: ${decrypted.toString(CryptoJS.enc.Utf8)}</div>`)
    $('#listMessages').scrollTop($('#listMessages').prop('scrollHeight'));
    // $("#listMessages").append(`<div class="listMessages"><span style="font-weight:700">${data.username}</span>: ${data.message}</div>`)
})
//Nguoi dung nhan tin nhan da duoc ma hoa nhung chua giai ma
socket.on('server-send-message-noencrypt', function (data) {
    if (data.id == socket.id) myMessage = 'myRight'; else myMessage = '';
    $("#listMessages").append(`<div class="messages ${myMessage}"><span style="font-weight:700">${data.username}</span>: ${data.message}</div>`)
    $('#listMessages').scrollTop($('#listMessages').prop('scrollHeight'));
    
})
socket.on('co-nguoi-go-phim', function (data) {
    $("#gophim").html(`<img src="/img/typing.gif" style="width: 30px"/><b>${data}</b> đang nhập văn bản`)
})
socket.on('khong-con-go-phim', function (data) {
    $("#gophim").html('')
})
$(document).ready(function () {
    $(".loginForm").show();
    // alert('avc')
    $("#btnRegister").click(function () {
        if ($("#txtUserName").val() != ""){
            socket.emit('Client-send-reg', $("#txtUserName").val());

        } else {
            $('.form-inline').addClass('has-error');
        }
    })
    $("#btnLogout").click(function () {
        socket.emit('logout');
        $(".chatForm").hide('1000');
        $(".loginForm").show('2000');

    })
    $("#btnSendMessage").click(function () {

        var encrypted = CryptoJS.AES.encrypt($("#txtMessage").val(),privateKey);
        socket.emit('user-send-message', encrypted.toString());
        $('#txtMessage').val('')

        // socket.emit('user-send-message', $("#txtMessage").val());
    })
    $("#btnNoEncrypt").click(function () {
        //Truoc khi gui di, ma hoa tin nhan
        var encrypted = CryptoJS.AES.encrypt($("#txtMessage").val(), privateKey);
        socket.emit('user-send-message-noencrypt', encrypted.toString());
        $('#txtMessage').val('')

        // Chay binh thuong khong ma hoa du lieu
        // socket.emit('user-send-message-noencrypt', $("#txtMessage").val());
    })
    $('#txtMessage').keydown(function (event) {
        var keypressed = event.keyCode || event.which;
        if (keypressed == 13) {
            var encrypted = CryptoJS.AES.encrypt($("#txtMessage").val(), privateKey);
            socket.emit('user-send-message', encrypted.toString());
            $('#txtMessage').val('')
            // socket.emit('user-send-message', $('#txtMessage').val());
        }
    });
    $('#txtUserName').keydown(function (event) {
        var keypressed = event.keyCode || event.which;
        if (keypressed == 13) {
            if ($("#txtUserName").val() != ""){
                socket.emit('Client-send-reg', $("#txtUserName").val());

            } else {
                $('.form-inline').addClass('has-error');
            }
        }
    });

    $('#txtMessage').focusin(function () {
        socket.emit('dang-go-phim')
    })
    $('#txtMessage').focusout(function () {
        socket.emit('ngung-go-phim')
    })
})