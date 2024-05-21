const mongoose = require("mongoose");

// Hur data för en anteckning ska struktureras
const noteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true, maxlength: 50 },
  text: { type: String, required: true, maxlength: 300 },
  createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date, default: Date.now },
});

// Middleware för att uppdatera modifiedAt när dokumentet sparas
noteSchema.pre("save", function (next) {
  // Endast uppdaterar modifiedAt om användre har ändrat i anteckning
  if (this.isModified()) {
    this.modifiedAt = Date.now();
  }
  next();
});

// Middleware för att Uppdatera modifiedAt vid findOneAndUpdate-operationer
noteSchema.pre("findOneAndUpdate", function (next) {
  // Sätt modifiedAt till nuvarande datum och tid vid uppdatering med hjälp av "Date"
  this.set({ modifiedAt: Date.now() });
  next();
});

module.exports = mongoose.model("Note", noteSchema);
