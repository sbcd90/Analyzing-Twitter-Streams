exports.push_to_db = function(tweet_id, text, user_id, geo_location, coordinates, place){
  var mongoclient = require('mongodb').MongoClient;
  mongoclient.connect("mongodb://admin:nitishsubho@ds035498.mongolab.com:35498/sbcd90", function(err, db){
    if(!err){
      console.log("We are connected");
      var twitter_doc = {'id' : tweet_id, 'text' : text, 'user_id' : user_id, 'geo_location' : geo_location, 'coordinates' : coordinates, 'place' : place};
      var tweets_collection = db.collection('tweets_collection');
      tweets_collection.insert(twitter_doc, function(err, inserted){});
    }
  });
}
