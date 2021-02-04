// Require dependencies //

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");

// declaring app and setup for connecting to server //

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// add database and connecting to it with making database //

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true, useUnifiedTopology: true });

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

// instead of defining different methods for get, post, delete everytime, Let's refactor it with the chaining method "route()" //

/////////////////// Request Targeting All Articles /////////////////////////////////

app.route("/articles")
    .get((req, res) => {
        Article.find(function (err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            }
            else {
                res.send(err);
            }
        });
    })
    .post(function (req, res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function (err) {
            if (!err) {
                res.send("successfully added a new article");
            }
            else {
                res.send(err);
            }
        });
    })
    .delete(function (req, res) {
        Article.deleteMany(function (err) {
            if (!err) {
                res.send("successfully deleted all articles");
            }
            else {
                res.send(err);
            }
        });
    });

//////////////// Request Targeting Specific articles //////////////////////////

app.route("/articles/:articleTitle")
    .get(function (req, res) {
        Article.findOne({ title: req.params.articleTitle }, function (err, foundArticle) {
            if (foundArticle) {
                res.send(foundArticle);
            }
            else {
                res.send("No articles found with the title");
            }
        });
    })
    .put(function(req, res){
        Article.update(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content},
            {overwrite: true},
            function(err){
                if(!err){
                    res.send("Successfully updated");
                }
                else{
                    res.send(err);
                }
            }
        );
    })
    .patch(function(req, res){
        Article.update(
            {title: req.params.articleTitle},
            {$set: req.body},
            function(err){
                if(!err){
                    console.log("Successfully updated article");
                }
                else{
                    res.send(err);
                }
            }
        );
    })
    .delete(function(req, res){
        Article.deleteOne(
            {title: req.params.articleTitle},
            function(err){
                if(!err){
                    res.send("Successfully deleted the corresponding article");
                }
                else{
                    res.send(err);
                }
            }
        );
    });


// // getting all article with get request from database //

// app.get("/articles", (req,res)=>{
//     Article.find(function(err, foundArticles){
//         if(!err){
//             res.send(foundArticles);
//         }
//         else{
//             res.send(err);
//         }
//     });
// });


// // post a new article & add to database with a post request //

// app.post("/articles", function(req, res){
//     const newArticle = new Article({
//         title: req.body.title,
//         content: req.body.content
//     });
//     newArticle.save(function(err){
//         if(!err){
//             res.send("successfully added a new article");
//         }
//         else{
//             res.send(err);
//         }
//     });
// });


// // delete all the data from the database //

// app.delete("/articles", function(req, res){
//     Article.deleteMany(function(err){
//         if(!err){
//             res.send("successfully deleted all articles");
//         }
//         else{
//             res.send(err);
//         }
//     });
// });

// define port on which server will start //

app.listen(80, function () {
    console.log("server started on port 80");
});