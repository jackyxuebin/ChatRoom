
/*
 * GET home page.
 */
function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

exports.home = function(req, res){
	if(typeof(req.session.username) == 'undefined'){
		res.render('home', { title: 'Express' });
	}else{
		res.redirect('/chat');
	}
};

exports.enter = function(req, res){
	var tempname=makeid();
	var username = req.body.username || tempname;	
	res.render('chatroom',{username:username});
};

exports.pvtchat = function(req, res){
	console.log("in pvtchat handler");
	var to = req.query.to;
	var from = req.query.from;
	console.log('from:'+from+'to:'+to);
	res.render('pvtChat',{from:from,to:to});
};