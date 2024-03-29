const { Schema, model, SchemaType } = require("mongoose");

const warningSchema = new Schema({
  _id: Schema.Types.ObjectId,
  userID: String,
  moderatorID: String,
  reason: String,
  date: Schema.Types.Date,
});

module.exports = model("Warning", warningSchema, "warnings");
