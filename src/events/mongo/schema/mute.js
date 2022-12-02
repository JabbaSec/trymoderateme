const { Schema, model, SchemaType } = require("mongoose");

const muteSchema = new Schema({
  _id: Number,
  userID: String,
  muteID: String,
  reason: String,
  date: Schema.Types.Date,
});

module.exports = model("Mute", muteSchema, "mutes");
