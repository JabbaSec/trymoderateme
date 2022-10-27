const {
    SlashCommandBuilder,
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
  } = require("discord.js");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("announce")
      .setDescription("Announce something using the bot!"),
    async execute(interaction, client) {
      const modal = new ModalBuilder()
        .setCustomId("announce-modal")
        .setTitle("Announcement");
  
      const roomInput = new TextInputBuilder()
        .setCustomId("modalRoomURL")
        .setLabel("Room URL")
        .setRequired(true)
        .setStyle(TextInputStyle.Short);
      
      const descriptionInput = new TextInputBuilder()
        .setCustomId("modalDescription")
        .setLabel("Description *Note will appear above URL")
        .setStyle(TextInputStyle.Paragraph);
  
      modal.addComponents(new ActionRowBuilder().addComponents(roomInput));
      modal.addComponents(new ActionRowBuilder().addComponents(descriptionInput));

      await interaction.showModal(modal);
    },
  };
  