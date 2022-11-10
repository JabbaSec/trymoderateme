const { Schema, model, SchemaType } = require("mongoose");

const noteSchema = new Schema({
  _id: Schema.Types.ObjectId,
  userID: String,
  moderatorID: String,
  note: String,
  date: Schema.Types.Date,
});

module.exports = model("Note", noteSchema, "notes");
