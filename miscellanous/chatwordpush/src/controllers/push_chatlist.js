exports.get = function(req,res){
	console.log("hitting chatlist");
	res.writeHead(200,{'Content-Type':'text/html'});
	res.write("<html><head></head><body><p>Hello World</p></body></html>");
	var getData = require('../controllers/getWordList').get();
	var getJSON = JSON.parse(getData);
//		console.log(getJSON.results[i].result.name);
	require('../models/mongolab_connect').push_to_db(getJSON.results);
	res.end();
}