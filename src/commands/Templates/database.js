const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Warning = require("../../events/mongo/schema/Warning");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("database")
    .setDescription("Test command for storing information in the database."),
  async execute(interaction, client) {
    const warningTest = await Warning.findOne({ userId: interaction.user.id });

    if (!warningTest) interaction.reply({ content: `No warnings found.` });
  },
};
