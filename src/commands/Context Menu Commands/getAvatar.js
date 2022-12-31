const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Get Avatar")
    .setType(ApplicationCommandType.User)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction, client) {
    await interaction.editReply({
      content: `Your avatar is: ${interaction.targetUser.displayAvatarURL()}`,
    });
  },
};
