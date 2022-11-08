const {
  SlashCommandBuilder,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("announce")
    .setDescription("Announce something using the bot!")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction, client) {
    const modal = new ModalBuilder()
      .setCustomId("announce-modal")
      .setTitle("Announcement");

    const roomInput = new TextInputBuilder()
      .setCustomId("modalRoomCode")
      .setLabel("Room Code")
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

    const descriptionInput = new TextInputBuilder()
      .setCustomId("modalTitle")
      .setLabel("Add some text *Note will appear first")
      .setRequired(false)
      .setStyle(TextInputStyle.Paragraph);

    modal.addComponents(new ActionRowBuilder().addComponents(roomInput));
    modal.addComponents(new ActionRowBuilder().addComponents(descriptionInput));

    await interaction.showModal(modal);
  },
};
