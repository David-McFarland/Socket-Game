var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static('public'));
/*
app.get('/', function(req, res){
  res.sendFile('/index.html', {'root': '../html'});
  //res.sendFile('/Game.js', {'root': '../script'});
});
*/
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
  	console.log(msg);
    io.emit('chat message', msg);
  });
});
//io.emit('some event', { for: 'everyone' });

http.listen(3000, function(){
  console.log('listening on *:3000');
});


/*
app.get('/', function(req, res){
  res.sendFile("index.html", {'root': '../'});
});
*/