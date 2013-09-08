var url = require('url');
var fs = require('fs');

exports.get = function(req,res){
	req.requrl = url.parse(req.url, true);
	var path = req.requrl.pathname;
	if(path=='/') 
		require('./controllers/fetch_from_twitter').get(req,res);
}
		
		
