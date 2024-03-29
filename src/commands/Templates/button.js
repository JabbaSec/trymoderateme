const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("button")
    .setDescription("Example code for Discord button component.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction, client) {
    const button = new ButtonBuilder()
      .setLabel("Example Button")
      .setCustomId("example-button")
      .setStyle(ButtonStyle.Primary);

    await interaction.editReply({
      components: [new ActionRowBuilder().addComponents(button)],
    });
  },
};
