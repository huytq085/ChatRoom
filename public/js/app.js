var socket = io('http://localhost:3001')
socket.on('server-send-thatbai', function(data){
    alert(`${data} có người sử dụng rồi`)
})
socket.on('server-send-thanhcong', function(data){
    $(".loginForm").hide('2000');
    $(".chatForm").show('1000');
    $("#currentUser").append(data)  
    //  $('#listUsers').append(data)
})
socket.on('server-send-thanhcong-moinguoi', function(data){
    // var $newdiv1 = $( "<p></p>" ),

     $('#listUsers').html("")
     
     data.forEach(function(i){
     $('#listUsers').append(`<div class="users">${i}</div>`)
     })
})
$(document).ready(function(){
    $(".loginForm").show();
    // alert('avc')
    $("#btnRegister").click(function(){
        socket.emit('Client-send-reg', $("#txtUserName").val());
    })
    $("#btnLogout").click(function(){
        socket.emit('logout');
        $(".chatForm").hide('1000');
    $(".loginForm").show('2000');
              
    })
})