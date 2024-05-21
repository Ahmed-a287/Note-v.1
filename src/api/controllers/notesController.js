const Note = require("../../models/noteSchema");
const mongoose = require("mongoose");

// Hämta alla anteckningar
exports.getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user._id });
    console.log("Notes retrieved:", notes);
    // Transformerar notes till att endast inkludera titel och text
    const simplifiedNotes = notes.map((note) => ({
      title: note.title,
      text: note.text,
    }));
    res.status(200).json(simplifiedNotes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).send(error);
  }
};

//Hitta en anteckning
exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.noteId);
    if (!note) {
      return res.status(404).send({ message: "Anteckningen finns ej!" });
    }
    res.status(200).json(note);
  } catch (error) {
    res.status(500).send({
      message: "Det gick inte att hämta anteckningen",
      error: error.message,
    });
  }
};

//Skapa en anteckning

exports.createNote = async (req, res) => {
  const userId = req.user._id;
  try {
    // Skapa en ny note med userId från den autentiserade användaren
    const newNote = new Note({
      // Access user ID from decoded token
      userId,
      title: req.body.title,
      text: req.body.text,
    });

    // Sparar anteckningen i databasen
    await newNote.save();
    // Skicka tillbaka den sparade anteckningen och status 201 (Created)
    res.status(201).send(newNote);
  } catch (error) {
    res.status(400).send(error);
  }
};

//Uppdatera en anteckning
exports.updateNote = async (req, res) => {
  try {
    // Extraherar userId, title och text från request body
    const { userId, title, text } = req.body;
    //Hämtar noteId från URL-parametrarna
    const noteId = req.params.id;
    // Först hitta anteckning med samma Note ID
    const note = await Note.findById(noteId);
    if (!note) {
      console.error(`Note with ID ${noteId} not found.`);
      return res.status(404).json({ message: "Note not found" });
    }
    // Kontrollerar om anteckningen tillhör användaren och att userId från body matchar den inloggade användarens ID
    if (
      note.userId.toString() !== req.user._id.toString() ||
      userId !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "User not authorized to update this note" });
    }

    // Om användaren äger noten, uppdatera den
    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { title, text, modifiedAt: new Date() },
      { new: true }
    );
    console.log(
      `Note updated successfully: Note ID ${noteId}, Title: ${title}`
    );
    res.status(200).json(updatedNote);
  } catch (error) {
    console.error(`Error updating note: ${error}`);
    res.status(400).json({ message: "Error updating note", error });
  }
};

// Funktion för att ta bort en anteckning
exports.deleteNote = async (req, res) => {
  // Hämtar noteId från URL-parametrarna
  const noteId = req.params.id;

  try {
    // Först hämta anteckningen med hjälp av Note id
    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Kontrollera om inloggad användare äger anteckningen
    if (note.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "User not authorized to delete this note" });
    }

    // Om allt är ok, ta bort noten
    await Note.findByIdAndDelete(noteId);
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error(`Error deleting note: ${error}`);
    res
      .status(500)
      .json({ message: "Error deleting note", error: error.toString() });
  }
};
