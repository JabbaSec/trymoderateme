const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

const { hasAdminAccess } = require("../../utils/permissions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Revokes the ban of a selected member.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to be unbanned.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for unbanning the user.")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    if (hasAdminAccess(interaction)) {
      const user = interaction.options.getUser("user");
      const reason = interaction.options.getString("reason");

      const unbanEmbed = new EmbedBuilder()
        .setAuthor({
          name: `${interaction.user.tag}`,
          iconURL: interaction.member.displayAvatarURL(),
        })
        .setColor("#00ff00")
        .setThumbnail(`${user.displayAvatarURL()}`)
        .setTitle(`:unlock: Unbanned ${user.tag} \n(${user.id})`)
        .setFields([
          {
            name: `Reason`,
            value: `${reason}`,
          },
        ]);

      interaction.guild.channels.cache
        .get(process.env.BOT_LOGGING)
        .send({ embeds: [unbanEmbed] })
        .catch((err) => console.log("[UNBAN] Error with sending the embed."));

      interaction.guild.members.unban(user);

      await interaction.editReply({
        content: `:unlock: ${user.tag} has been unbanned.`,
      });
    } else {
      await interaction.editReply({
        content: `Nice try! You are not an administrator`,
        ephemeral: true,
      });
    }
  },
};
