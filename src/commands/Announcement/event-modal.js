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
    .setName("event")
    .setDescription("Announce an event using the bot!")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction, client) {
    const modal = new ModalBuilder()
      .setCustomId("event-modal")
      .setTitle("Event");

    const titleInput = new TextInputBuilder()
      .setCustomId("modalTitle")
      .setLabel("Add a title!")
      .setRequired(false)
      .setStyle(TextInputStyle.Short);

    const descriptionInput = new TextInputBuilder()
      .setCustomId("modalDescription")
      .setLabel("Description")
      .setRequired(false)
      .setStyle(TextInputStyle.Paragraph);

    const dateInput = new TextInputBuilder()
      .setCustomId("modalDate")
      .setLabel("Set a date (yyyy/mm/dd hh:mm:ss)")
      .setRequired(false)
      .setStyle(TextInputStyle.Short);

    modal.addComponents(new ActionRowBuilder().addComponents(titleInput));
    modal.addComponents(new ActionRowBuilder().addComponents(descriptionInput));
    modal.addComponents(new ActionRowBuilder().addComponents(dateInput));

    await interaction.showModal(modal);
  },
};
