const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
} = require("discord.js");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("getAvatar")
    .setType(ApplicationCommandType.User),
  async execute(interaction, client) {
    await interaction.reply({
      content: `Your avatar is: ${interaction.targetUser.displayAvatarURL()}`,
    });
  },
};
