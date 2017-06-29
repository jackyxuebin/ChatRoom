
/**
 * Module dependencies.
 */
var clients=[];
var userlist=[];
var express = require('express');
var http = require('http');
var path = require('path');
var chat = require('./routes/chat');
var app = express();
var port =3000;
var io = require('socket.io').listen(app.listen(port));
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', chat.home);
app.get('/pvtChat',chat.pvtchat);
app.post('/',chat.enter);


io.sockets.on('connection',function(socket){
	//console.log(io.sockets.manager.rooms);
	//console.log(io.sockets.clients());
	socket.on('auth',function(data){
		//socket.set('username',data.message);
		socket.username=data.message;
		clients[data.message]=socket.id;
		userlist.push(data.message);
		socket.emit('message',{message: 'welcome to the chat'});
		socket.broadcast.emit('message',{message: data.message +' has joined the room'});
		/*for(var i=0;i<userlist.length;i++){
			console.log(userlist[i]);
		}*/
		io.sockets.emit('userlist',{userlist:userlist});
		//console.log(socket.get('username',function(){}));
	});
	
	socket.on('send',function(data){
		
		//console.log(socket.get('username'));
		io.sockets.emit('message',data);
	});
	

	socket.on('pvtchat',function(data){
		console.log("captured pvtchat");
		var from=data.from;
		var to=data.to;
		var msg=data.message;

		io.sockets.connected[clients[to]].emit('pvtchat',{from:from,to:to,message:msg});
		//io.sockets.socket(clients[from]).emit('pvtchat',{from:from,to:to,message:msg});
		
	});
	socket.on('disconnect',function(){
		//socket.get('username',function(err,username){
			var username=socket.username;
			var i=userlist.indexOf(username);
			userlist.splice(i,1);
			delete clients[username];
			socket.broadcast.emit('message',{message: username+' has left the room'});
			socket.broadcast.emit('userlist',{userlist:userlist});
		//});				
		
	});
});

console.log("Listening on port "+ port);