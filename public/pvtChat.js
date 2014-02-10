window.onload = function(){
	
	$(document).ready(function() {
		$("#field").keyup(function(e) {
			if(e.keyCode == 13) {
				sendMessage();
			}
		});
	});
	var message = [];
	//var socket = io.connect('http://localhost:3000');
	var field = document.getElementById("field");
	var sendButton = document.getElementById("send");
	var content = document.getElementById("content");
	var sidebar = document.getElementById("sidebar");
	
	//var name= document.getElementById('name');
	//socket.emit('auth',{message: document.getElementById("username").value});
	/*socket.on('pvtMessage', function(data){		
		if(data.message){
			//alert(data);
			message.push(data);
			var html='';
			for(var i=0;i<message.length;i++){
				
				html+='<b>' + (message[i].username ? message[i].username : 'Server')+': <b />';
				html+=message[i].message + '<br />';
				
			}
			content.innerHTML = html;
		}
		else{
			console.log("There is a problem:",data);
		}
	});
	*/
	/*socket.on('userlist',function(data){
		
		if(data.userlist){
			//alert("userlist");
			var html='';
			var userlist=data.userlist;
			for(var i=0;i<userlist.length;i++){
				html+='<b><a href="/pvtChat?to='+userlist[i]+'" target="_blank">'+userlist[i]+'</a></b><br />'
			}
			sidebar.innerHTML = html;
		}
	});
	*/
	/*socket.on('pvtchat',function(data){
		if(data.from && data.to && data.message){
			var html='';
			alert('from:'+data.from+'to:'+data.to+'message:'+data.message);
		}
	});*/
	sendButton.onclick=sendMessage=function(){
		var from = document.getElementById("from").value;
		var to = document.getElementById("to").value;
		var message = field.value;
		//alert(from);
		//alert(to);
		//alert(message);
		window.opener.sendPvtMessage(from,to,message);
		field.value = '';
		
	};
}