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
socket.on('server-logout', function () {
    
    $("#currentUser").html('')
    // alert('a')
})
socket.on('server-send-thanhcong-moinguoi', function (data) {
    // var $newdiv1 = $( "<p></p>" ),

    $('#listUsers').html("")

    data.forEach(function (i) {
        $('#listUsers').append(`<div class="users">${i}</div>`)
    })
})
//Nguoi dung nhan tin nhan da duoc giai ma
socket.on('server-send-message', function (data) {
    //Giai ma tin nhan truoc khi gui
    var decrypted = CryptoJS.AES.decrypt(data.message, "Secret Passphrase");
    $("#listMessages").append(`<div class="listMessages"><span style="font-weight:700">${data.username}</span>: ${decrypted.toString(CryptoJS.enc.Utf8)}</div>`)
    // $("#listMessages").append(`<div class="listMessages"><span style="font-weight:700">${data.username}</span>: ${data.message}</div>`)
})
//Nguoi dung nhan tin nhan da duoc ma hoa nhung chua giai ma
socket.on('server-send-message-noencrypt', function (data) {
    $("#listMessages").append(`<div class="listMessages"><span style="font-weight:700">${data.username}</span>: ${data.message}</div>`)
})
socket.on('co-nguoi-go-phim',function(data){
$("#gophim").html(`<img src="/img/typing.gif" style="width: 30px"/><b>${data}</b> đang nhập văn bản`)
})
socket.on('khong-con-go-phim',function(data){
$("#gophim").html('')
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
        var encrypted = CryptoJS.AES.encrypt($("#txtMessage").val(), "Secret Passphrase");
        socket.emit('user-send-message', encrypted.toString());
        $('#txtMessage').val('')

        // socket.emit('user-send-message', $("#txtMessage").val());
    })
    $("#btnNoEncrypt").click(function () {
        //Truoc khi gui di, ma hoa tin nhan
        var encrypted = CryptoJS.AES.encrypt($("#txtMessage").val(), "Secret Passphrase");
        socket.emit('user-send-message-noencrypt', encrypted.toString());
        $('#txtMessage').val('')

        // Chay binh thuong khong ma hoa du lieu
        // socket.emit('user-send-message-noencrypt', $("#txtMessage").val());
    })
    $('#txtMessage').keydown(function (event) {
        var keypressed = event.keyCode || event.which;
        if (keypressed == 13) {
            var encrypted = CryptoJS.AES.encrypt($("#txtMessage").val(), "Secret Passphrase");
            socket.emit('user-send-message', encrypted.toString());
            $('#txtMessage').val('')
            // socket.emit('user-send-message', $('#txtMessage').val());
        }
    });
    $('#txtUserName').keydown(function (event) {
        var keypressed = event.keyCode || event.which;
        if (keypressed == 13) {
            socket.emit('Client-send-reg', $("#txtUserName").val());
        }
    });
    $('#txtMessage').focusin(function(){
        socket.emit('dang-go-phim')
    })
    $('#txtMessage').focusout(function(){
        socket.emit('ngung-go-phim')
    })
})