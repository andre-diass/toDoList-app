
////////////////////////////////////////////////////initialize app////////////////////////////////////////////////////////
//require npm packages
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const lodash = require("lodash")

/* app.use( function(req, res, next) { // Ignore favicon.ico requests.

  if (req.originalUrl && req.originalUrl.split("/").pop() === 'favicon.ico') {

     return res.sendStatus(204);

  }

  return next();

}); */

//tell app to use ejs and bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs"); 

//connect to mongoDB  
mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://admin:Teste123@cluster0.h5o6m6a.mongodb.net/todolistDB");



/////////////////////////////////////////create moongose schema, colection and default itemslist///////////////////////////

const itemSchema = {
  name: String
};

const Item = mongoose.model("Item" , itemSchema);

const item1 = new Item({
  name: "Assistir Harry Potter Relíquias da Morte parte 2"
});


const item2 = new Item({
  name: "Acertar tudo no tutorial de esquizofrenia"
});

const item3 = new Item({
  name: "Estudar"
});

const defaultItems = [item1, item2, item3];  

const listSchema = new mongoose.Schema({
  name: String, 
  items: [itemSchema] //an array of items documents associated with it
});

const List = mongoose.model("List", listSchema);




///////////////////////////////////////////////////handle form and render page////////////////////////////////////////////////

//the application “listens” for requests that match the specified route(s) and method(s), and when it detects a match, it calls the specified callback function.
app.get("/", function (req, res) {
  
  Item.find({}, function (err, items) {
      if(items.length === 0) {
        
        Item.insertMany(defaultItems , function(err) {
          if(err) {
            console.log(err);
          } else{
            console.log("Succsessfully added default items to DB");
          }
        });
        res.redirect("/")  
      } else {res.render("list", { listTitle: "Hoje", newListItems: items });}
        
  });  
  
});

app.get("/:customListName" , function(req, res) {
  const customListName = lodash.capitalize(req.params.customListName);
  
  List.findOne({name:customListName} , (err, result) => {
    if (!err){
      if(!result){
        //create new list
        const list = new List({
          name: customListName,
          items: defaultItems
        });
          list.save();
          res.redirect("/" + customListName);
      }
      else{
        //show an existing list
        res.render("list" , {listTitle: result.name, newListItems: result.items})
      }};
  });
  
  
});


//catch the post request by the form, gather the data and redirect
app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  
  const item = new Item ({
    name: itemName
  });
  
  if (listName === "Hoje"){
    item.save();
    res.redirect("/");  //re enter the the home rout by the get method and render the page
  } else{
    List.findOne({name:listName} , (err, result) => {
      result.items.push(item);
      result.save();
      res.redirect("/" + listName);
      
    });
  }
  
});


 app.post("/delete" , function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName= req.body.listName;
  
  if (listName === "Hoje") {
    Item.findByIdAndRemove(checkedItemId , function(err) {
      if(!err){
        console.log("sucssefully deleted item");
        res.redirect("/")
      }
    });
  }else{
    List.findOneAndUpdate({name:listName}, {$pull:{items: {_id:checkedItemId}}} , (err, result) => {
      if(!err) {
        res.redirect("/" + listName);
      }
    }); 
  }
}); 



let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);

