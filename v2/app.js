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

app.post("/", function(req, res) {
  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });
  item.save();

  res.redirect("/")

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
