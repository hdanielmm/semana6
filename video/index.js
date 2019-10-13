const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Note = require("./models/Note");
const cookieSession = require("cookie-session");

const loger = (req, res, next) => {
  console.log("Nueva petición HTTP");
  next();  
}

mongoose.connect("mongodb://localhost:27017/notes", { useUnifiedTopology: true, useNewUrlParser: true});

app.set("view engine", "pug");
app.set("views", "views");
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static("public"));
app.use(cookieSession({
  secret: "una cadena secreta",
  maxAge: 24 * 60 * 60 * 1000
}));
app.use(loger);

// Muestra notas
app.get("/", async (req, res) => {
  const notes = await Note.find();
  res.render("index", { notes });
});

// Muestra formulario para crear notas
app.get("/notes/new", (req, res) => {
  res.render("new");
}); 

// Permite crear una nota
app.post("/notes", async (req, res, next) => {
  const data = {
    title: req.body.title,
    body: req.body.body
  };

  try {
    const note = new Note(data);
    await note.save();
  } catch (e) {
    return next(e)
  }
  res.redirect("/");
});

app.post("/notes2", (req, res) => {
  console.log(req.body);
  res.redirect("/notes/new");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Algo salió mal");
});

app.listen(3000, () => console.log("Listen on port 3000"));
// db.users.insertMany([
//   { email: "oriana@gmail.com", firstName: "Oriana", lastName: "Cogolle", age: 33, gender: "female" },
//   { email: "daniel@gmail.com", firstName: "Daniel", lastName: "Marin", age: 35, gender: "male" },
//   { email: "david@gmail.com", firstName: "David", lastName: "Muños", age: 35, gender: "male" },
//   { email: "diego@gmail.com", firstName: "Diego", lastName: "Marquez", age: 37, gender: "male" },
//   { email: "kevin@gmail.com", firstName: "Kevin", lastName: "Madrid", age: 28, gender: "male" }
// ])

// db.notes.insertMany([
//   { title: "Nota 1", body: "Esta es la nota número uno"},
//   { title: "Nota 2", body: "Esta es la nota número dos"},
//   { title: "Nota 3", body: "Esta es la nota número tres"},
//   { title: "Nota 4", body: "Esta es la nota número cuatro"},
//   { title: "Nota 5", body: "Esta es la nota número cinco"},
// ])