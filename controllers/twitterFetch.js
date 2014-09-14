exports.startFetch = function(request,response){
    var url = require('url');
    var url_parts = url.parse(request.url,true);
    var query = url_parts.query;
    
    var getFromMaps = query;
    
    console.log(getFromMaps);
    var formJSON = '';
    if(getFromMaps.id==undefined)
        formJSON = formJSON + '[';
    var formLocation = '[';
    
    var callBack = function(){
        var OAuth = require('oauth');
        var response = response;
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
            function(err,data,res){
                console.log(response);
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
                if(getFromMaps.id!=undefined){
                    var woeids = getFromMaps.id;
                    woeidArr = woeids.split(",");
                    console.log(woeidArr);
                    data = [];
                    for(var formNew=0;formNew<woeidArr.length;formNew++){
                        data.push({"woeid" : woeidArr[formNew]});
                    }
                }
                for(var formloc=0;formloc<data.length;formloc++){
                    formLocation = formLocation + '{"woeid" : "' + data[formloc].woeid + '"},';
                }
                formLocation = formLocation.slice(0,-1) + ']';
                if(getFromMaps.id==undefined){
                    var yqlquery = 'http://query.yahooapis.com/v1/public/yql?q=select * from geo.placefinder where text="' + getFromMaps.center_lat + ',' + getFromMaps.center_long + '" and gflags="R"&format=json';
                    console.log(yqlquery);
                    var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.open("GET",yqlquery,false);
                    xmlhttp.send();
                    var responseJSON = JSON.parse(xmlhttp.responseText);
                    var currentLocWoeid = responseJSON.query.results.Result.woeid;
                    data.unshift({"woeid" : '"' + currentLocWoeid + '"'});
                }
                var asyncFlag = false;
                var firstTime = true;
                var count = 0;
                setInterval(function(){
                    var restrictedLength = 15;
                    if(data.length<15)
                        restrictedLength = data.length;
                    for(;count<restrictedLength+1;){
                    if((asyncFlag==true) || (firstTime==true)){
                    if(firstTime==true)
                        firstTime = false;
                    var woeid = data[count].woeid;
                    console.log(woeid);    
                    var latitude = undefined;
                    var longitude = undefined;
                    var yqlquery = 'http://query.yahooapis.com/v1/public/yql?q=select * from geo.placefinder where woeid = ' + woeid + ' and gflags="R"&format=json';
                    var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.open("GET",yqlquery,false);    
                    xmlhttp.onreadystatechange = function(){
                        if(xmlhttp.readyState==4 && xmlhttp.status==200){
                            var responseJSON = JSON.parse(xmlhttp.responseText);
                            latitude = parseFloat(responseJSON.query.results.Result.latitude);
                            longitude = parseFloat(responseJSON.query.results.Result.longitude);
                            var googleMaps = getFromMaps;
                            if((latitude==0 && longitude==0)||((latitude>=parseFloat(googleMaps.topLeft_latitude) && latitude<=parseFloat(googleMaps.bottomRight_latitude)) && ((parseFloat(googleMaps.topLeft_longitude)<=parseFloat(googleMaps.bottomRight_longitude) && longitude>=parseFloat(googleMaps.topLeft_longitude) && longitude<=parseFloat(googleMaps.bottomRight_longitude)))||(parseFloat(googleMaps.topLeft_longitude)>parseFloat(googleMaps.bottomRight_longitude) && longitude>=-180 && longitude<=180))){
                                if(asyncFlag==true)
                                    asyncFlag = false;
                                var oldCount = count;
                                var trendsurl = 'https://api.twitter.com/1.1/trends/place.json?id=' + woeid;
                                var newOAuth = require('oauth');
                                var oauthnext = new newOAuth.OAuth(
                                    'https://api.twitter.com/oauth/request_token',
                                    'https://api.twitter.com/oauth/access_token',
                                    'tn7574JE7gvHN8z5AqgXOg',
                                    'T0hrD8oYo7d0gtbqPIsyxhqYrAWeKiSxOdaXble0A2k',
                                    '1.0A',
                                    null,
                                    'HMAC-SHA1'
                                );
                                oauthnext.get(
                                    trendsurl,
                                    '846948925-wwZw1TFbAGmaGsADH9WipmMXwM31gEUaiMk7RUsW',
                                    'q3uUx8YefbyOzeMXmCa91OO4DomDaefUBDwUZnQ',
                                    function(err,data,res){
                                        asyncFlag = true;
                                        count = oldCount + 1;
                                        if(err){
                                            console.log(err);
                                            return;
                                        }
                                        data = JSON.parse(data);
                                        console.log(data);
                                        for(var check=0;check<data.length;check++){
                                            var trends = data[check].trends;
                                            for(var counted=0;counted<trends.length;counted++){
                                                var name = trends[counted].name;
                                                var url = trends[counted].url;
                                                console.log(name);
                                                console.log(url);
                                                var infoWindow = '{"name" : "' + name + '", "url" : "' + url + '", "latitude" : "' + latitude + '", "longitude" : "' + longitude + '"}';
                                                formJSON = formJSON + infoWindow + ",";
                                            }
                                        }
                                    }
                                );
                            }
                        }
                    };
                    xmlhttp.send();    
                }
                    count++;
                }
                },3000);
            }
        );
    };
    callBack();
    setTimeout(function(){
        if(getFromMaps.id!=undefined)
            response.end(formJSON.slice(0,-1));
        else
            response.end('{"locations" : ' + formLocation + ',"trends" : ' + formJSON.slice(0,-1) + ']}');
    },60000);
};