const { Schema, model } = require("mongoose");

const reportSchema = new Schema({
  _id: Schema.Types.ObjectId,
  userID: { type: String, required: true, unique: true }, // User being denied
  moderatorID: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = model("Report", reportSchema, "reports");
