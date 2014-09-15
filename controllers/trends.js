exports.getTrends = function(req,res){
    var url = require('url');
    var url_parts = url.parse(req.url,true);
    
    var query = url_parts.query;
    
    var getFromMaps = query;
    
    var woeid = getFromMaps.id;
    
    var OAuth = require('oauth');
    var oauth = new OAuth.OAuth(
                    'https://api.twitter.com/oauth/request_token',
                    'https://api.twitter.com/oauth/access_token',
                    '3DgQULws1dG8ayDU80BdsktXX',
                    'XN29jPhpxQe5gnxtNubJVI3Kg6HvHLUASxj9sFk1uxI4NZ8JY5',
                    '1.0A',
                    null,
                    'HMAC-SHA1'
    );
    
    var trendsurl = 'https://api.twitter.com/1.1/trends/place.json?id=' + woeid;
    var formJSON = '[';
    
    oauth.get(
        trendsurl,
        '846948925-6gb43J2juelE8ZyS6hKUnXYiqKStPu3mSuxMupNj',
        'JBbnRuUeYb2hX00arwZWl3HKutjE8wGBuu7WJX1pspuon',
        function(err,data,response){
            if(err){
                console.log(err);
                return;
            }
            
            data = JSON.parse(data);
            for(var countRecords=0;countRecords<data.length;countRecords++){
                var trends = data[countRecords].trends;
                for(var countTrends=0;countTrends<trends.length;countTrends++){
                    var name = trends[countTrends].name;
                    var url = trends[countTrends].url;
                    var infoWindow = '{"name" : "' + name + '", "url" : "' + url + '"}';
                    formJSON = formJSON + infoWindow + ',';
                }
            }
            res.end(formJSON.slice(0,-1) + ']');
        });
};