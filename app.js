const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require('mongoose')

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

mongoose.connect('mongodb://localhost:27017/todolist' ,{ useNewUrlParser: true ,useUnifiedTopology: true ,useFindAndModify: false})

const itemSchema ={
  name: String
}

const Item = mongoose.model('Item', itemSchema)
const item1 = new Item({
  name: "welcome"
})
const item2 = new Item({
  name: "hit + to add "
})
const item3 = new Item({
  name: "to delete"
})

const defalultItems = [item1, item2,item3]



app.get("/", (req, res) => {
  Item.find({}, function(err, founditems){
    if(founditems.length ===0){
      Item.insertMany(defalultItems, function(err){
        if(err){
          console.log(err)
        }else{
          console.log("successfully added");
      }
    })
    res.redirect('/')
    }else{
      res.render("list", { kindOfDay: "today", newListItem: founditems });
    }

});
})

app.post('/' , (req ,res) =>{
  const itemName = req.body.newItem;
  const item = new Item({
    name : itemName
  })
  item.save()
  res.redirect('/')
})

app.post("/delete", function(req , res){
  const checkedItemId = req.body.checkBox
  Item.findByIdAndRemove(checkedItemId ,function(err){
    if(!err){
      console.log("succefully deleted")
      res.redirect('/')
    }
  })
})

app.listen(3000, function () {
  console.log("listening on 3000");
});
