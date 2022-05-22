const express = require("express");
const res = require("express/lib/response");
const { render } = require("express/lib/response");
const {ObjectId} = require('mongodb')
const app = express();

//Middleware för att inte få en tom request body
const bodyParser = require('body-parser');

const mongoose = require("mongoose");
const { db } = require("./models/member");

//för att skapa en ny instans av en member
const Member = require('./models/member');


//Börja lyssna när kontakt med databasen är etablerad
const dbURI = 'mongodb://localhost:27017/memberdatabase';
mongoose.connect(dbURI)
.then((result) => app.listen(3000))
.catch((err) => console.log(err))


app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set("view engine", "ejs");

app.use(express.static("scss"));



//GET
app.get('/add-member' , (req, res) => {
  res.render('form')
})

app.get("/", (req, res) => {
  res.render("index");
})
app.get("/index", (req, res) => {
  res.render("index");
})

app.get("/members", (req, res) => {
  console.log(req.query)
  let sort;
  if(req.query.sort == "a-z"){
   sort = Member.find().sort({ name: 1 })
  }
  else if(req.query.sort == "z-a"){
    sort = Member.find().sort({ name: -1 })
   }
  else{
    sort = Member.find()
  }
  sort.then((result) => {
   res.render('members', { members: result })
  })
  .catch((err) => {
    console.log(err)
  })
})

app.get('/members/:id', (req, res) => {
  const id = req.params.id;
  Member.findById(id)
  .then(result => {
    res.render('details', { member: result });
  })
  .catch(err => {
    console.log(err)
  })
})

app.get('/updatemember/:id', (req, res) => {
  const id = req.params.id;
  Member.findById(id)
  .then(result => {
    res.render('updatemember', { member: result });
  })
  .catch(err => {
    console.log(err)
  })
})

//DELETE
app.delete('/members/:id', (req, res) => {
  const id = req.params.id;
  Member.findByIdAndDelete(id)
  .then(result => {
    res.json({ redirect: '/members' })
  })
  .catch(err => {
    console.log(err);
  })
})

//POST
app.post('/members', (req, res) => {
  const member = new Member(req.body);

  member.save()
  .then((result) => {
    res.redirect('/members');
  })
  .catch((err) => {
    console.log(err)
  })
})

//PATCH
app.patch('/updatemember/:id', (req, res) => {
  const updates = req.body;
  console.log(updates)

  if(ObjectId.isValid(req.params.id)){
    db.collection('members')
    .updateOne({_id: ObjectId(req.params.id)}, {$set: updates})

    .then(result => {
      res.redirect('/members');
    })
    .catch(err => {
      console.log(err)
    })
  }
  else{
    res.status(500).json({error: "not valid doc id"})
  }
})


//404
app.use((req, res) => {
  res.status(404).render("404");
})

