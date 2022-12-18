const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("banspam")
    .setDescription("Bans a user who's account has been compromised.")
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
      const reason = interaction.options.getString("reason");

      const member = await interaction.guild.members
        .fetch(user.id)
        .catch((err) =>
          console.log(`[BANSPAM] Cannot find user in the server.`)
        );

      if (member) {
        if (!member.bannable || null)
          return interaction.reply({
            content: "I am having some trouble with banning this member.",
            ephemeral: true,
          });

        if (
          member.roles.highest.position >=
            interaction.member.roles.highest.position ||
          null
        )
          return interaction.reply({
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
            value: `Compromised Account`,
          },
        ]);

      await user
        .send({
          content: `Your account has been caught spamming and may have been compromised. Please email \`bans@tryhackme.com\` once you regain control of your account.`,
        })
        .catch((err) => console.log(`[BANSPAM] Cannot DM ${user.tag}`));

      interaction.guild.channels.cache
        .get(process.env.BOT_LOGGING)
        .send({ embeds: [banEmbed] })
        .catch((err) => console.log("[BANSPAM] Error with sending the embed."));

      await interaction.reply({
        content: `Done!`,
      });

      try {
        member.ban({
          reason: `Compromised Account`,
          deleteMessageSeconds: 7 * 24 * 60 * 60,
        });
      } catch {
        interaction.guild.members.ban(user, {
          reason: `Compromised Account`,
          deleteMessageSeconds: 7 * 24 * 60 * 60,
        });
        interaction.followUp({
          content: `[BANSPAM] I cannot DM ${user.tag}!`,
        });
      }
    } else {
      await interaction.reply({
        content: `Nice try! You are not a moderator`,
        ephemeral: true,
      });
    }
  },
};
