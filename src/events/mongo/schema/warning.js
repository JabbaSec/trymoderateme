const { Schema, model } = require("mongoose");

const warningSchema = new Schema({
  _id: Schema.Types.ObjectId,
  userID: String,
  moderatorID: String,
  reason: String,
});

module.exports = model("Warning", warningSchema, "warnings");
