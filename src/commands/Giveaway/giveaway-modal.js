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
    .setName("giveaway")
    .setDescription("Start a giveaway.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction, client) {
    const modal = new ModalBuilder()
      .setCustomId("giveaway-modal")
      .setTitle("Giveaway Setup");

    const durationInput = new TextInputBuilder()
      .setCustomId("modalDuration")
      .setLabel("End date (YYYY/MM/DD hh:mm:ss)")
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

    const amountInput = new TextInputBuilder()
      .setCustomId("modalWinnerAmount")
      .setLabel("Amount of winners")
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

    const prizesInput = new TextInputBuilder()
      .setCustomId("modalPrizes")
      .setLabel("Prizes, *separate each prize with a newline")
      .setRequired(true)
      .setStyle(TextInputStyle.Paragraph);

    modal.addComponents(new ActionRowBuilder().addComponents(durationInput));
    modal.addComponents(new ActionRowBuilder().addComponents(amountInput));
    modal.addComponents(new ActionRowBuilder().addComponents(prizesInput));

    await interaction.showModal(modal);
  },
};
