var express = require("express");
var mongoose = require("mongoose");
bodyParser = require('body-parser')
const expressLayouts = require('express-ejs-layouts');
// Require all models
var db = require("./models");

var pr = require("./models/Product");
var re = require("./models/Review");
console.log(db);

// Connect to MongoDB
mongoose.connect("mongodb+srv://ankit034:ankitsrivastava98@cluster0.lwn5a.mongodb.net/grocerydb?retryWrites=true&w=majority", { useNewUrlParser: true });

var PORT = 3000;

// Initialize Express
var app = express();

// Parse request body as JSON
app.use(bodyParser.json({limit: '50mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))

app.use(expressLayouts);
app.set('view engine','ejs');

// Make public static folder
app.use(express.static("public"));

app.get("/first", function(req,res) {
  db.Product.find().then((results)=>{
    res.render('first',{pro: results});
  })
  .catch((err)=>{
    console.log(err);
  })
});
app.get("/second", function(req,res) {
  db.Review.find().then((results)=>{
    res.render('second',{pro: results});
  })
  .catch((err)=>{
    console.log(err);
  })
});
// Routes for testing on postman
app.get("/products", function(req,res) {
  db.Product.find({})
  .then(function(dbProducts) {
    res.json(dbProducts);
  })
  .catch(function(err) {
    res.json(err);
  })
});
// Route to get all reviews
app.get("/reviews", function(req,res) {
  db.Review.find({})
  .then(function(dbReviews) {
    res.json(dbReviews);
  })
  .catch(function(err) {
    res.json(err);
  })
});
/*app.get("/rev", function(req,res) {
  db.Product.aggregate([{
    $lookup: {
        from: "db.Review",
        localField: "full_name",
        foreignField: "full_name",
        as: "ankit"
    }
}, {
    $unwind: "$ankit"
},
{
  $project:{full_name:1, email:1, city:1 ,url:1 }
}],function( err, data ) {

    if ( err )
      throw err;

    console.log( JSON.stringify( data, undefined, 2 ) );

  }
)});*/

/*app.get("/rev", function(req,res) {
    pr
  .find()
  .populate("review")
  .exec(function(err, users) {
    console.log(users);
    res.json(users);
  });  
});*/
/*async.waterfall(
  [
      function(callback) {
        pr.find({},{ "_id": 1 },callback);
      },
      function(students,callback) {
          re.find({
              "email": { "$in": students.map(function(el) {
                  return el._id
              })
          },callback);
      }
  ],
  function(err,results) {
     if (err) {
        res.send(err);
     } else {
        res.json(results);
     }
    }*/
    
app.get("/rev", function(req,res) {
  console.log("froms erver");
  pr.aggregate([{
    $lookup: {
        from: "reviews",
        localField: "full_name",
        foreignField: "full_name",
        as: "ankit"
    }
}, {     $unwind: "$ankit" },{$project:{"_id":0,"full_name":1,"number":1,"email":1,"city":1,"url":1,"team_name":"$ankit.team_name"}}],function( err, data ) {

    if ( err )
      throw err;
    //res.render('third',{pro:data});
    res.json(data);
    console.log( JSON.stringify( data, undefined, 2 ) );

  }
)});
// Route for creating a new Product

app.post("/product", async function(req, res) {
  var x=req.body;
  await x.forEach((y)=>{
    db.Product.create(y)
    .then(function(dbProduct) {
      // If we were able to successfully create a Product, send it back to the client
      res.json(dbProduct);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
  }).catch(error => { throw error});
  
});
app.post("/pro", async function(req, res) {
  var x=req.body;
  await x.forEach((y)=>{
    db.Review.create(y)
    .then(function(dbProduct) {
      // If we were able to successfully create a Product, send it back to the client
      res.json(dbProduct);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
  }).catch(error => { throw error});
  
});
/*app.post("/product", function(req, res) {
  db.Product.create(req.body)
    .then(function(dbProduct) {
      // If we were able to successfully create a Product, send it back to the client
      res.json(dbProduct);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});*/

// Home route. Currently just to make sure app is running returns hello message.
app.get("/", function(req, res) {
  res.render('welcome');
});


// Start the server
app.listen(PORT, function() {
  console.log("Listening on port " + PORT + ".");
});
