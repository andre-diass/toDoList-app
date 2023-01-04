
///////////////////////////////////////initialize app////////////////////////////////////////////////////////
//require npm packages
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "\\date.js"); //the date object is bound to the exports of the date module

//tell app to use ejs and bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs"); 

//declare global variables
let workItems = [];

//connect to mongoDB
mongoose.connect('mongodb://127.0.0.1:27017/todolistDB'); 
mongoose.set("strictQuery", true);


/////////////////////////////////////////create moongose schema, colection and default itemslist//////////////////////////////
//create mongoose schema
const itemSchema = new mongoose.Schema({
  name: String
});

//create Item colection
const Item = mongoose.model("Item" , itemSchema);

//create data document
const item1 = new Item({
  name: "workout"
});

const item2 = new Item({
  name: "study"
});

const defaultItems = [item1, item2];

Item.insertMany(defaultItems , function(err) {
  if(err) {
    console.log(err);
  } else{
    console.log("Succsessfully added default items to DB");
  }
  
});



///////////////////////////////////////////////////handle form and render page////////////////////////////////////////////////

//the application “listens” for requests that match the specified route(s) and method(s), and when it detects a match, it calls the specified callback function.
app.get("/", function (req, res) {
  
  Item.find(function (err, items) {
      if(items.length === 0) {
        res.redirect("/") 
        Item.insertMany(defaultItems , function(err) {
          if(err) {
            console.log(err);
          } else{
            console.log("Succsessfully added default items to DB");
          }
        });
           
      } else {res.render("list", { listTitle: "Today", newListItems: items });}
        
  });  
  
});

//catch the post request by the form, gather the data and redirect
app.post("/", function (req, res) {
  let item = req.body.newItem;
  console.log(req.body);

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", function (req, res) {
  res.render("about", {});
});

app.listen(3000, function () {
  console.log("server started on port 3000");
});
