const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const { default: mongoose } = require("mongoose");
const Warning = require("../../events/mongo/schema/warning");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Give a user a warning.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to be warned.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for the warning.")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    if (interaction.member.roles.cache.has(process.env.MOD_ROLE_ID)) {
      const user = interaction.options.getUser("user");
      const reason = interaction.options.getString("reason");

      newWarning = await new Warning({
        _id: mongoose.Types.ObjectId(),
        userID: user.id,
        moderatorID: interaction.member.id,
        reason: reason,
        date: Date.now(),
      });

      await newWarning.save().catch(console.error);

      const warningEmbed = new EmbedBuilder()
        .setAuthor({
          name: `${interaction.user.tag}`,
          iconURL: interaction.member.displayAvatarURL(),
        })
        .setColor("#ff0000")
        .setThumbnail(`${user.displayAvatarURL()}`)
        .setTitle(":warning: Warning")
        .setFooter({ text: `${newWarning._id}` })
        .setFields([
          {
            name: `${user.tag}`,
            value: `${reason}`,
          },
        ]);

      interaction.guild.channels.cache
        .get(process.env.BOT_LOGGING)
        .send({ embeds: [warningEmbed] }).catch((err) => console.log("[WARN] Error with sending the embed."));

      await interaction.reply({
        content: `${user} has been warned.`,
      })

      await user
      .send({ content: `:warning: You have been warned!\nReason: ${reason}` })
      .catch((err) => interaction.followUp({content: `[WARNING] I cannot DM that user.`}));

    } else {
      await interaction.reply({
        content: `Nice try! You are not a moderator`,
        ephemeral: true,
      });
    }
  },
};
