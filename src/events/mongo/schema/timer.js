const { Schema, model, SchemaType } = require("mongoose");

const timerSchema = new Schema({
  _id: Number,
});

module.exports = model("Timer", timerSchema, "timers");
