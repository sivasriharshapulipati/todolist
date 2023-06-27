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

const listSchema = {
  name:String,
  items:[itemsSchema]
};

const List = mongoose.model("List",listSchema);

app.get("/", async function(req, res) {
  try {
    const foundItems = await Item.find({});

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems)
        .then(result => {
          console.log('Default items inserted');
        })
        .catch(error => {
          console.error('Error inserting default items:', error);
        });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
  } catch (error) {
    console.error('Error finding items:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get("/:customListName",function(req,res){
  const customListName = req.params.customListName;

  List.findOne({ name: customListName })
  .then(foundList => {
    if (!foundList) {
      //create a new list 
      const list = new List({
        name:customListName,
        items:defaultItems
      });
      list.save()
      res.redirect("/"+customListName);
    } else {
     //show a existing list 

     res.render("list",{listTitle:foundList.name, newListItems:foundList.items});
    }
  })
  .catch(err => {
    console.log("An error occurred:", err);
  });
});

// app.post("/", function(req, res) {
//   const itemName = req.body.newItem;
//   const customListName = req.body.List;

//   const item = new Item({
//     name: itemName
//   });

//   if (customListName === "Today"){
//     item.save();
//     res.redirect("/")
//   }else{
//     List.findOne({name:customListName},function(err,foundList){
//       foundList.items.push(item);
//       foundList.save();
//       res.redirect("/"+customListName);
//     })
//   }
// });

app.post("/", async function(req, res) {
  const itemName = req.body.newItem;
  const customListName = req.body.list;

  const item = new Item({
    name: itemName
  });

  try {
    if (customListName === "Today") {
      await item.save();
      res.redirect("/");
    } else {
      const foundList = await List.findOne({ name: customListName });
      foundList.items.push(item);
      await foundList.save();
      res.redirect("/" + customListName);
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox;
  Item.findOneAndRemove({ _id: checkedItemId })
    .then(() => {
      console.log("Successfully deleted checked item");
      res.redirect("/");
    })
    .catch(error => {
      console.error("Error deleting checked item:", error);
      res.status(500).send("Internal Server Error");
    });
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
