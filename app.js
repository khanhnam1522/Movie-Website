var express = require("express");
var app = express();
const request = require("request");

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", function(req,res){
	res.render("search");
});

app.get("/results", function(req,res){
	var queryName = req.query.searchName;
	var queryYear = req.query.searchYear;
	var url = "https://omdbapi.com/?s=" + queryName +"&y=" + queryYear + "&apikey=thewdb";
	request(url, function(error, response, body){
		if(!error && response.statusCode == 200){
			const data = JSON.parse(body);
			if(data["Response"] === "True"){
				res.render("results", {data: data});
			} else {
				res.render("notFound");
			}
		} 
	});
});

app.listen(process.env.PORT || 3000, function(){
	console.log("Movie/Games Search App is running!!!");
});