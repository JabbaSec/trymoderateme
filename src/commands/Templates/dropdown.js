const {
  SlashCommandBuilder,
  ActionRowBuilder,
  SelectMenuBuilder,
  SelectMenuOptionBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dropdown")
    .setDescription("Example code for Discord select menu component.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction, client) {
    const dropdown = new SelectMenuBuilder()
      .setCustomId("example-dropdown")
      .setMinValues(1)
      .setMaxValues(1)
      .setOptions(
        new SelectMenuOptionBuilder({
          label: "Option 1",
          value: "option-1",
        }),
        new SelectMenuOptionBuilder({
          label: "Option 2",
          value: "option-2",
        })
      );

    await interaction.editReply({
      components: [new ActionRowBuilder().addComponents(dropdown)],
    });
  },
};
