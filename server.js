var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));
var http = require('http').Server(app);

var io = require('socket.io')(http);
var ss = require("superscript");
var facts = require("sfacts");

var options = {
  scope: {
    cnet : require("conceptnet")({host:'127.0.0.1', user:'root', pass:''})
  }
}
var data = ['./data/color.tbl'];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});



var botHandle = function(err, bot) {
    
  io.on('connection', function(socket) {
    console.log("User '" + socket.id + "' has connected.\n");
    socket.emit('chat message', {text:'Welcome to the SuperScript Color Demo!\n'});
    
    socket.on('chat message', function(msg){
      // Emit the message back first
      socket.emit('chat message', { text: ">> " + msg });
      bot.reply(socket.id, msg.trim(), function(err, resObj){
        var color = resObj.color || "#fff";
        socket.emit('chat message', { text: "<< " + resObj.string, color:color });
      });
    });
  });

  http.listen(3000, function(){
    console.log('listening on *:3000');
  });
}


facts.load(data, 'localdata', function(err, facts){
  options.factSystem = facts; 
      
  new ss('./data.json', options, function(err, botInstance){
    botHandle(null, botInstance);
  });
});


