//jshint esversion:6

// const express = require("express");
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");


// const app = express();

// app.set('view engine', 'ejs');

// app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.static("public"));

// // mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true});
// mongoose.connect("mongodb://0.0.0.0:27017/todolistDB", { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log("Connected to MongoDB");

// const itemsSchema = {
//   name:String

// };

// const Item = mongoose.model("Item",itemsSchema);

// const item1 = new Item({
//   name:"welcome to ur todo list"
// });

// const item2 = new Item({
//   name:"hello"
// });

// const item3 = new Item({
//   name:"wonder"
// });

// const defaultItems = [item1,item2,item3];

// Item.insertMany(defaultItems)
//       .then(result => {
//         console.log('Default items inserted:');
//       })
//       .catch(error => {
//         console.error('Error inserting default items:', error);
//       });
//   })
//   .catch(error => {
//     console.error('Error connecting to MongoDB:', error);
//   });

//   app.get("/", function(req, res) {
//     Item.find({}, function(err, foundItems) {
//       res.render("list", { listTitle: "Today", newListItems: foundItems });
//     });
//   });



// app.post("/", function(req, res){

//   const item = req.body.newItem;

//   if (req.body.list === "Work") {
//     workItems.push(item);
//     res.redirect("/work");
//   } else {
//     items.push(item);
//     res.redirect("/");
//   }
// });

// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// });

// app.get("/about", function(req, res){
//   res.render("about");
// });

// app.listen(3000, function() {
//   console.log("Server started on port 3000");
// });

//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://0.0.0.0:27017/todolistDB", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your todo list!"
});

const item2 = new Item({
  name: "Hello"
});

const item3 = new Item({
  name: "Wonder"
});

const defaultItems = [item1, item2, item3];

Item.insertMany(defaultItems)
  .then(result => {
    console.log('Default items inserted:');
  })
  .catch(error => {
    console.error('Error inserting default items:', error);
  });

app.get("/", async function(req, res) {
  try {
    const foundItems = await Item.find({});
    res.render("list", { listTitle: "Today", newListItems: foundItems });
  } catch (error) {
    console.error('Error finding items:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post("/", function(req, res) {
  const item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function(req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
