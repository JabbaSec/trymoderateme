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
    ),
  async execute(interaction, client) {
    if (interaction.member.roles.cache.has(process.env.MOD_ROLE_ID)) {
      const user = interaction.options.getUser("user");
      const member = interaction.options.getMember("user");
      const reason = interaction.options.getString("reason");

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

      await interaction.reply({
        content: `:hammer: ${user.tag} has been banned.`,
      });
    } else {
      await interaction.reply({
        content: `Nice try! You are not a moderator`,
        ephemeral: true,
      });
    }
  },
};
