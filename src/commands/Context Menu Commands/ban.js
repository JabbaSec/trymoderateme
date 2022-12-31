const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Ban")
    .setType(ApplicationCommandType.User)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction, client) {
    if (interaction.member.roles.cache.has(process.env.MOD_ROLE_ID)) {
      await interaction.reply({
        content: `You are now banned ${interaction.targetUser}`,
      });
    } else {
      await interaction.reply({
        content: `Nice try! You are not a moderator`,
        ephemeral: true,
      });
    }
  },
};
