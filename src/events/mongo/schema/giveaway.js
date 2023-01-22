const { Schema, model, SchemaType } = require("mongoose");

const giveawaySchema = new Schema({
  _id: Schema.Types.ObjectId,
  userID: String,
});

module.exports = model("Giveaway", giveawaySchema, "giveaways");
