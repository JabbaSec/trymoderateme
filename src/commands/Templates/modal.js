const {
  SlashCommandBuilder,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("modal")
    .setDescription("Example code for Discord modal component."),
  async execute(interaction, client) {
    const modal = new ModalBuilder()
      .setCustomId("example-modal")
      .setTitle("Example Modal");

    const textInput = new TextInputBuilder()
      .setCustomId("exampleModalInput")
      .setLabel("Example Input")
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

    modal.addComponents(new ActionRowBuilder().addComponents(textInput));

    await interaction.showModal(modal);
  },
};
