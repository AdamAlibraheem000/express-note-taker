const { response } = require("express");
const express = require("express");
const fs = require("fs");
const router = require("express").Router();
const path = require("path"); //library to assist in looking up file path
let { notes } = require("./db/db.json");
// Helper method for generating unique ids
// ids for update & delete requests
// const uuid = require("./helpers/uuid");

const PORT = process.env.PORT || 3001; //Heroku hosting

const app = express();

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
// Takes incoming POST requests & turns them into key/value pairs that can be
// accessed by req.body
app.use(express.static("public"));

// search notes by ID
// Does not work
function findById(id, notesArray) {
  const result = notesArray.filter((note) => note.id === id)[0];
  return result;
}

// Gets homepage
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

//gets notes page
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

// get json file
// app.get("/api/db/db", (req, res) => {
//   res.json(notes);
// });

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

// Post requests

app.post("/api/notes", (req, res) => {
  // set id based on next array index
  req.body.id = notes.length.toString();

  // add note to json file & notes array in this function
  notes = createNewNote(req.body, notes);

  res.json(notes);
});

// Create new note
function createNewNote(body, notesArray) {
  const note = body;
  notesArray.push(note);
  console.log(notesArray);
  fs.writeFileSync(
    "./db/db.json",
    JSON.stringify({ notes: notesArray }, null, 2)
  );

  return notesArray;
}
// fs required

app.listen(PORT, () => {
  console.log(`API server http://localhost:${PORT}  `);
});
