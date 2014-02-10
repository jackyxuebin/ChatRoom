window.onload = function(){
	
	$(document).ready(function() {
		$("#field").keyup(function(e) {
			if(e.keyCode == 13) {
				sendMessage();
			}
		});
	});
	var message = [];
	pvtMessage =[];
    pvtChatWindow =[];
    socket = io.connect('http://182.19.242.103:3000');
	var field = document.getElementById("field");
	
	var sendButton = document.getElementById("send");
	var content = document.getElementById("content");
	var sidebar = document.getElementById("sidebar");
	var from = document.getElementById("username").value;
	//var name= document.getElementById('name');
	socket.emit('auth',{message: document.getElementById("username").value});
	socket.on('message', function(data){		
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
	
	socket.on('userlist',function(data){
		
		if(data.userlist){
			//alert("userlist");
			var html='';
			var userlist=data.userlist;
			for(var i=0;i<userlist.length;i++){
				//html+='<b><a href="/pvtChat?from='+from+'&to='+userlist[i]+'" target="_blank">'+userlist[i]+'</a></b><br />'
				var url='/pvtChat?from='+from+'&to='+userlist[i];
				//alert(url);
				html+='<b><a href=javascript:newPopup("'+url+'")>'+userlist[i]+'</a></b><br />'
			}
			sidebar.innerHTML = html;
		}
	});
	
	socket.on('pvtchat',function(data){
		if(data.from && data.to && data.message){
			var html='';
			//alert('from:'+data.from+'to:'+data.to+'message:'+data.message);
			var from = data.to;
			var to = data.from;
			var url='/pvtChat?from='+from+'&to='+to;
			if(!pvtChatWindow[url] || pvtChatWindow[url].closed){
				//alert("new window");
				var dialogue = newPopup(url);
				
				pvtMessage[url].push(data);
				dialogue.addEventListener('load',function(){
					var pvtContent = dialogue.document.getElementById("content");
					//alert(pvtContent);
				
			
					for(var i=0;i<pvtMessage[url].length;i++){
				
					html+='<b>' + (pvtMessage[url][i].from ? pvtMessage[url][i].from : 'Server')+': <b />';
					html+=pvtMessage[url][i].message + '<br />';
				
					}
					pvtContent.innerHTML = html;
				});
			}else{
				//alert("existing window");
				var dialogue = pvtChatWindow[url];
				//alert(dialogue);
				var pvtContent = dialogue.document.getElementById("content");
			    //alert(pvtContent);
				pvtMessage[url].push(data);
			
				for(var i=0;i<pvtMessage[url].length;i++){
				
					html+='<b>' + (pvtMessage[url][i].from ? pvtMessage[url][i].from : 'Server')+': <b />';
					html+=pvtMessage[url][i].message + '<br />';
				
				}
				pvtContent.innerHTML = html;
			}
		}
	});
	sendButton.onclick = sendMessage = function(){
			var text = field.value;
			var username = document.getElementById("username").value;
			socket.emit('send',{message: text, username: username});
			field.value="";
		}
		
	};
	sendPvtMessage = function(from,to,message){
		//alert("sending message");
		socket.emit('pvtchat',{from:from,to:to,message:message});
		var url='/pvtChat?from='+from+'&to='+to;
		var html = '';
		var dialogue = pvtChatWindow[url];
				//alert(dialogue);
		var pvtContent = dialogue.document.getElementById("content");
		pvtMessage[url].push({from:from,to:to,message:message});
			
		for(var i=0;i<pvtMessage[url].length;i++){
				
			html+='<b>' + (pvtMessage[url][i].from ? pvtMessage[url][i].from : 'Server')+': <b />';
			html+=pvtMessage[url][i].message + '<br />';
				
		}
		pvtContent.innerHTML = html;
	}
	function newPopup(url) {
	
		var popupWindow = window.open(
			url,url,'popUpWindow','height=700,width=800,left=10,top=10,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes');
		pvtChatWindow[url]=popupWindow;
		if(!pvtMessage[url]){
			pvtMessage[url]=[];
		}
		//alert("pushed");
		return popupWindow;
	}
