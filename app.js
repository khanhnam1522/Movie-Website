var express = require("express");
var app = express();
const request = require("request");
bodyParser = require("body-parser");
mongoose = require("mongoose");

// mongoose.connect("mongodb://localhost:3000/comments", { useNewUrlParser: true,  useUnifiedTopology: true  });
mongoose.connect("mongodb+srv://namt:nam150297@moviegamesearch-sgagf.gcp.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true,  useUnifiedTopology: true  })

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

//Mongoose config
var commentSchema = new mongoose.Schema({
	name: String,
	created: {type:Date, default: Date.now},
	body: String
})
var comment = mongoose.model("Comments", commentSchema);

//RESTFUL ROUTES
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

//COMMENT list
app.get("/comments", function(req,res){
	comment.find({}, function(err,comments){
		if(err){
			console.log("ERROR!");
		} else {
			res.render("comments", {comments: comments});
		}
	})
});

//FORM
app.get("/comments/new", function(req,res){
	res.render("new");
});

//Post comment
app.post("/comments", function(req,res){
	comment.create(req.body.comment, function(err, newComment){
		if(err){
			res.render("new");
		} else {
			res.redirect("/comments");
		}
	});
});

app.listen(process.env.PORT || 3000, function(){
	console.log("Movie/Games Search App is running!!!");
});