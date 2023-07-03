const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("talkend")
    .setDescription("End the talk with a user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to end the talk with")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for ending the talk")
        .setRequired(false)
    ),
  async execute(interaction) {
    try {
      const user = interaction.options.getUser("user");
      const reason = interaction.options.getString("reason");
      const guild = interaction.guild;

      // Remove the 'talk-with-us' role from the user
      const role = guild.roles.cache.find(
        (role) => role.name === "talk-with-us"
      );
      const member = guild.members.cache.get(user.id);
      await member.roles.remove(role);

      // Archive the user's thread in the 'TALK_WITH_US' channel
      const channel = guild.channels.cache.find(
        (channel) => channel.name === "talk-with-us"
      );
      const thread = channel.threads.cache.find(
        (thread) => thread.name === user.username
      );
      await thread.setArchived(true);

      // Send an embed to the 'BOT_LOGGING' channel
      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${interaction.user.tag}`,
          iconURL: interaction.member.displayAvatarURL(),
        })
        .setColor("#00ff00")
        .setThumbnail(`${user.displayAvatarURL()}`)
        .setTitle(":speech_balloon: Talk ended")
        .setFields([
          {
            name: `${user.tag}`,
            value: `${reason}`,
          },
        ]);

      interaction.guild.channels.cache
        .get(process.env.BOT_LOGGING)
        .send({ embeds: [embed] })
        .catch((err) => console.log("[TALKEND] Error with sending the embed."));

      await interaction.editReply({
        content: "Thread archived and user role removed.",
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "An error occurred while trying to end the talk.",
        ephemeral: true,
      });
    }
  },
};
