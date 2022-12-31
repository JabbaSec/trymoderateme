const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("giveaway")
    .setDescription("Starts a giveaway!")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption((option) =>
      option
        .setName("duration")
        .setDescription("The giveaway duration (1d, 1h, 1m).")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("prize")
        .setDescription("The prize to be won.")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("prize_amount")
        .setDescription("The amount of prizes to be given away.")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    if (interaction.member.roles.cache.has(process.env.MOD_ROLE_ID)) {
      const duration = interaction.options.getString("duration");
      const prize_amount = interaction.options.getInteger("prize_amount");
      const prize = interaction.options.getString("prize");
    } else {
      await interaction.editReply({
        content: `Nice try! You are not a moderator`,
        ephemeral: true,
      });
    }
  },
};
