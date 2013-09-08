exports.get = function(req,res){
  var OAuth = require('oauth').OAuth;
  var oauth = new OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    'tn7574JE7gvHN8z5AqgXOg',
    'T0hrD8oYo7d0gtbqPIsyxhqYrAWeKiSxOdaXble0A2k',
    '1.0A',
    null,
    'HMAC-SHA1'
  );
  setInterval(function(){
    oauth.get(
      'https://api.twitter.com/1.1/search/tweets.json?q=%23mother&result_type=mixed&count=1',
      '846948925-wwZw1TFbAGmaGsADH9WipmMXwM31gEUaiMk7RUsW',
      'q3uUx8YefbyOzeMXmCa91OO4DomDaefUBDwUZnQ',
      function(e, data, res){
	if(e) console.error(e);

	var cleandata = JSON.parse(data);
	var tweet_id = cleandata.statuses[0].id_str;
	var text = cleandata.statuses[0].text;
	var user_id = cleandata.statuses[0].user.id_str;
	var geo_location = cleandata.statuses[0].geo;
	var coordinates = cleandata.statuses[0].coordinates;
	var place = cleandata.statuses[0].place;

	require('../models/mongolab_connect').push_to_db(tweet_id,text,user_id,geo_location,coordinates,place);
      });
  },60000);
}

