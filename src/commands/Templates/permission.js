const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("permission")
    .setDescription("Tests the permission of a user.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction, client) {
    const role = await interaction.guild.roles
      .fetch(process.env.MOD_ROLE_ID)
      .catch(console.error);

    if (interaction.member.roles.cache.has(process.env.MOD_ROLE_ID)) {
      await interaction.reply({ content: `You have the ${role.name} role.` });
    } else {
      await interaction.reply({
        content: `You do not have the ${role.name} role.`,
      });
    }
  },
};
