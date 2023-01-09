
////////////////////////////////////////////////////initialize app////////////////////////////////////////////////////////
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

//connect to mongoDB
mongoose.connect('mongodb://127.0.0.1:27017/todolistDB'); 
mongoose.set("strictQuery", true);


/////////////////////////////////////////create moongose schema, colection and default itemslist///////////////////////////
//create mongoose schema
const itemSchema = new mongoose.Schema({
  name: String
});

const listSchema = new mongoose.Schema({
  name: String, 
  items: [itemSchema] //an array of items documents associated with it
});


//create model
const Item = mongoose.model("Item" , itemSchema);
const List = mongoose.model("List", listSchema);

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

app.get("/:customListName" , function(req, res) {
  const customListName = req.params.customListName;
  
  const list = new List({
    name: customListName,
    items: defaultItems
  });
  
  list.save();
});


//catch the post request by the form, gather the data and redirect
app.post("/", function (req, res) {
  let itemName = req.body.newItem;
  const item = new Item ({
    name: itemName
  });
  
  
  item.save();
  res.redirect("/");  //re enter the the home rout by the get method and render the page
});


app.post("/delete" , function (req, res) {
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId , function(err) {
    if(!err){
      console.log("sucssefully deleted item");
      res.redirect("/")
    }
    
  });
  
});

app.listen(3000, function () {
  console.log("server started on port 3000");
});


/* console.log(req.body);

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
} */


/* app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", function (req, res) {
  res.render("about", {});
}); */