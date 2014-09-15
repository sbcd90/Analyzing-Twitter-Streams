exports.getLocations = function(req,res){
    var url = require('url');
    var url_parts = url.parse(req.url,true);
    
    var query = url_parts.query;
    
    var getFromMaps = query;
    
    var formLocation = '[';
    
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
    oauth.get(
                'https://api.twitter.com/1.1/trends/available.json',
                '846948925-6gb43J2juelE8ZyS6hKUnXYiqKStPu3mSuxMupNj',
                'JBbnRuUeYb2hX00arwZWl3HKutjE8wGBuu7WJX1pspuon',
                function(err,data,response){
                    if(err){
                        console.log(err);
                        return;
                    }
                    
                    for(var parser=data.length-1;parser>=0;parser--){
                        if((data[parser]=='e')&&(data[parser-1]=='m')&&(data[parser-2]=='a')&&(data[parser-3]=='n')&&(data[parser-4]=='"')&&(data[parser-5]=='{')&&(data[parser-6]==',')){
                            data = data.substr(0,parser-6) + ']';
                            break;
                        }
                    }
                    
                    data = JSON.parse(data);
                    var yqlquery = 'http://query.yahooapis.com/v1/public/yql?q=select * from geo.placefinder where text="' + getFromMaps.center_lat + ',' + getFromMaps.center_long + '" and gflags="R"&format=json';
                    var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.open("GET",yqlquery,false);
                    xmlhttp.send();
                    var responseJSON = JSON.parse(xmlhttp.responseText);
                    var currentLocWoeid = responseJSON.query.results.Result.woeid;
                    data.unshift({"woeid" : currentLocWoeid});
                    
                    for(var count=0;count<100;count++){
                        var woeid = data[count].woeid;
                        var latitude = undefined;
                        var longitude = undefined;
                        
                        var yqlquery = 'http://query.yahooapis.com/v1/public/yql?q=select * from geo.placefinder where woeid = ' + woeid + ' and  gflags="R"&format=json';
                        var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
                        var xmlhttp = new XMLHttpRequest();
                        xmlhttp.open('GET',yqlquery,false);
                        xmlhttp.onreadystatechange = function(){
                            if(xmlhttp.readyState==4 && xmlhttp.status==200){
                                var responseJSON = JSON.parse(xmlhttp.responseText);
                                latitude = parseFloat(responseJSON.query.results.Result.latitude);
                                longitude = parseFloat(responseJSON.query.results.Result.longitude);
                                console.log(latitude);
                                console.log(longitude);
                                
                                var googleMaps = getFromMaps;
                                if((latitude==0 && longitude==0)||((latitude>=parseFloat(googleMaps.topLeft_latitude) && latitude<=parseFloat(googleMaps.bottomRight_latitude)) && ((parseFloat(googleMaps.topLeft_longitude)<=parseFloat(googleMaps.bottomRight_longitude) && longitude>=parseFloat(googleMaps.topLeft_longitude) && longitude<=parseFloat(googleMaps.bottomRight_longitude)))||(parseFloat(googleMaps.topLeft_longitude)>parseFloat(googleMaps.bottomRight_longitude) && longitude>=-180 && longitude<=180))){
                                    formLocation = formLocation + '{"woeid" : "' + woeid + '", "latitude" : "' + latitude.toString() + '", "longitude" : "' + longitude.toString() + '"},';
                                    console.log(formLocation);
                                }
                            }
                        };
                        xmlhttp.send();
                    }
                    res.end(formLocation.slice(0,-1) + ']');
                });
};