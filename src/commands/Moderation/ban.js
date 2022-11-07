const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bans a user permanently from the server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to be banned.")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    if (interaction.member.roles.cache.has(process.env.MOD_ROLE_ID)) {
      const user = interaction.options.getUser("user");
      const member = interaction.options.getMember("user");

      if (!member.bannable)
        return interaction.reply({
          content: "I am having some trouble with banning this member.",
          ephemeral: true,
        });

      if (
        member.roles.highest.position >=
        interaction.member.roles.highest.position
      )
        return interaction.reply({
          content: "User's permissions are the same as or higher than yours.",
          ephemeral: true,
        });

      await interaction.reply({ content: `You are now banned.` });
    } else {
      await interaction.reply({
        content: `Nice try! You are not a moderator`,
        ephemeral: true,
      });
    }
  },
};
