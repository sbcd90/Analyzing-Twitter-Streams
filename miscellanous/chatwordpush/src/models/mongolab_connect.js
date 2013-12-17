exports.push_to_db = function(valarray){
	var mongoclient = require('mongodb').MongoClient;
	mongoclient.connect("mongodb://sbcd90:algo..addict965431@ds035498.mongolab.com:35498/sbcd90", function(err, db){
		if(!err){
			console.log("We are connected");
			var chatword_collection = db.collection('chatwords');
			for(var i=0;i<valarray.length;i++){
				var name = valarray[i].result.name;
				var value = valarray[i].result.value;
				var chatword_record = {'id' : name, 'value' : value};
				chatword_collection.insert(chatword_record,function(err,inserted){
					if(!err)
						console.log("Record is pushed");
				});
			}
		}
	});
}