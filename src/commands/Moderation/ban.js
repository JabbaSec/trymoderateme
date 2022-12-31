const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
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
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for banning the user.")
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("delete_messages")
        .setDescription("Delete user messages")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    if (interaction.member.roles.cache.has(process.env.MOD_ROLE_ID)) {
      const user = interaction.options.getUser("user");
      const reason = interaction.options.getString("reason");
      const deleteMessageSeconds =
        interaction.options.getBoolean("delete_messages");

      if (deleteMessageSeconds) {
        deleteMessages = 7 * 24 * 60 * 60;
      } else {
        deleteMessages = 0;
      }

      const member = await interaction.guild.members
        .fetch(user.id)
        .catch((err) => console.log(`[BAN] Cannot find user in the server.`));

      if (member) {
        if (!member.bannable || null)
          return interaction.editReply({
            content: "I am having some trouble with banning this member.",
            ephemeral: true,
          });

        if (
          member.roles.highest.position >=
            interaction.member.roles.highest.position ||
          null
        )
          return interaction.editReply({
            content: "User's permissions are the same as or higher than yours.",
            ephemeral: true,
          });
      }

      const banEmbed = new EmbedBuilder()
        .setAuthor({
          name: `${interaction.user.tag}`,
          iconURL: interaction.member.displayAvatarURL(),
        })
        .setColor("#ff0000")
        .setThumbnail(`${user.displayAvatarURL()}`)
        .setTitle(`:hammer: Banned ${user.tag} \n(${user.id})`)
        .setFields([
          {
            name: `Reason`,
            value: `${reason}`,
          },
        ]);

      const dmEmbed = new EmbedBuilder()
        .setColor("#ff0000")
        .setThumbnail(`${user.displayAvatarURL()}`)
        .setTitle(`:hammer: Banned ${user.tag}`)
        .setFooter({
          text: `To appeal this ban, please email bans@tryhackme.com`,
        })
        .setFields([
          {
            name: `Reason`,
            value: `${reason}`,
          },
        ]);

      await user
        .send({ embeds: [dmEmbed] })
        .catch((err) => console.log(`[BAN] Cannot DM ${user.tag}`));

      interaction.guild.channels.cache
        .get(process.env.BOT_LOGGING)
        .send({ embeds: [banEmbed] })
        .catch((err) => console.log("[BAN] Error with sending the embed."));

      await interaction.editReply({
        content: `:hammer: ${user.tag} has been banned.`,
      });

      try {
        member.ban({ reason: reason, deleteMessageSeconds: deleteMessages });
      } catch {
        interaction.guild.members.ban(user, {
          reason: reason,
          deleteMessageSeconds: deleteMessages,
        });
        interaction.followUp({
          content: `[BAN] User left the discord server.`,
        });
      }
    } else {
      await interaction.editReply({
        content: `Nice try! You are not a moderator`,
        ephemeral: true,
      });
    }
  },
};
