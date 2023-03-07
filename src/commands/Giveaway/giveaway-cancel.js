const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Data = require("../../events/mongo/schema/data");
const { default: mongoose } = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cancel")
    .setDescription("Stops the current giveaway."),
  async execute(interaction, client) {
    let findGiveaway = await Data.findOne({});

    if (findGiveaway) {
    clearTimeout(findGiveaway.id);
    findGiveaway.delete();
    
    interaction.editReply({ content: `Giveaway cancelled.` });
    }
  },
};
