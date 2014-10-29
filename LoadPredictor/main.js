var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket){
  console.log(socket.request.connection._peername.address);

  socket.on('cpu-usage', function(msg){
    console.log(msg)
    io.emit('cpu-ip', JSON.stringify({ip: socket.request.connection._peername.address,
                                usage: msg}));
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});
