var express = require("express");
var app = express();

app.set("views", __dirname + '/views');
app.set('view engine','jade');
app.use(express.static(__dirname + '/public'));


app.get("/twitterFetch", function(req,res){
    require('./controllers/twitterFetch').startFetch(req,res);
});

app.get("/", function(req,res){
    res.render('maps');
});

app.listen(3000,function(){
    console.log("Listening on port 3000");
});