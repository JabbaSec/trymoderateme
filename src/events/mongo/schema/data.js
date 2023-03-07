const { Schema, model, SchemaType } = require("mongoose");

const dataSchema = new Schema({
  _id: Schema.Types.ObjectId,
  id: Number,
  length: Number,
  amount: Number,
});

module.exports = model("Data", dataSchema, "data");

