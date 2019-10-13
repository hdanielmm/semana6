const mongoose = require("mongoose");

const NoteSchema = mongoose.Schema({
  title: String,
  body: String
});

// Modelo
const Note = mongoose.model("Note", NoteSchema);

module.exports = Note;