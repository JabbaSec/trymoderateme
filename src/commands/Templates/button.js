const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("button")
    .setDescription("Example code for Discord button component."),
  async execute(interaction, client) {
    const button = new ButtonBuilder()
      .setLabel("Example Button")
      .setCustomId("example-button")
      .setStyle(ButtonStyle.Primary);

    await interaction.reply({
      components: [new ActionRowBuilder().addComponents(button)],
    });
  },
};
