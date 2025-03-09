const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  PermissionsBitField,
} = require("discord.js");

const { hasAdminAccess } = require("../../utils/permissions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("permission")
    .setDescription("Tests the permission of a user.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction, client) {
    const role = await interaction.guild.roles
      .fetch(process.env.MOD_ROLE_ID)
      .catch(console.log);

    if (interaction.member.roles.cache.has(process.env.MOD_ROLE_ID)) {
      await interaction.editReply({
        content: `You have the ${role.name} role.`,
      });
    } else if (hasAdminAccess(interaction)) {
      await interaction.editReply({
        content: `You are an administrator.`,
      });
    } else {
      await interaction.editReply({
        content: `You do not have the ${role.name} role.`,
      });
    }
  },
};
