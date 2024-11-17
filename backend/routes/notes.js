const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

//Route 1: Fetch all notes using user token form api/notes/fetchallnotes
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ userid: req.user.id });

    return res.json({ notes });
  } catch (error) {
    res.json({ message: error.message });
  }
});
//Route 2: add notes notes using user token form api/notes/add Notes
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Title should be min of 3 letters").isLength({ min: 3 }),
    body("description", "Description should be min of 5 letters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const { title, description, tag } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      try {
        console.log(req.user.id);
        const notes = await Notes.create({
          userid: req.user.id,
          title,
          description,
          tag,
        });
        return res.status(201).json({ notes });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
      }
    }
  }
);

//Route 3: update notes by notesid from api/notes/update:id
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  let newNote = {};
  if (title) {
    newNote.title = title;
  }
  if (description) {
    newNote.description = description;
  }
  if (tag) {
    newNote.tag = tag;
  }
  console.log("newNote: ", newNote);
  //find notes using userID
  let note = await Notes.findById(req.params.id);
  console.log("from note: ", note);
  if (!note) {
    return res.status(404).json({ message: "Not found" });
  }
  if (note.userid.toString() !== req.user.id) {
    return res.status(403).json({ message: "Access Denied" });
  }
  note = await Notes.findByIdAndUpdate(
    req.params.id,
    { $set: newNote },
    { new: true }
  );
  return res.status(201).json({ note });
});

router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  const newNote= {}
  let note = await Notes.findById(req.params.id);
  console.log("from note: ", note);
  if (!note) {
    return res.status(404).json({ message: "Not found" });
  }
  if (note.userid.toString() !== req.user.id) {
    return res.status(403).json({ message: "Access Denied" });
  }
  note = await Notes.findByIdAndDelete(
    req.params.id,
    // { $set: newNote },
    // { new: true }
  );
  return res.status(201).json({message: `Note with title: "${note.title}" has been deleted Successfully` });
});


module.exports = router;
