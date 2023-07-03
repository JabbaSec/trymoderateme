const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("talkto")
    .setDescription("Talk to a user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to talk to")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for talking")
        .setRequired(true)
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");
    const guild = interaction.guild;

    // Add the 'talk-with-us' role to the user
    const role = guild.roles.cache.find((role) => role.name === "talk-with-us");
    const member = guild.members.cache.get(user.id);
    await member.roles.add(role);

    // Create a thread in the 'TALK_WITH_US' channel
    const channel = guild.channels.cache.find(
      (channel) => channel.name === "talk-with-us"
    );
    const thread = await channel.threads.create({
      name: user.username,
      autoArchiveDuration: 60,
      reason: reason,
    });
    await thread.members.add(user);

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${interaction.user.tag}`,
        iconURL: interaction.member.displayAvatarURL(),
      })
      .setColor("#ff0000")
      .setThumbnail(`${user.displayAvatarURL()}`)
      .setTitle(":speech_balloon: Talk with us")
      .setFooter({ text: `${thread.id}` })
      .setFields([
        {
          name: `${user.tag}`,
          value: `${reason}`,
        },
      ]);

    const threadUrl = `https://discord.com/channels/${guild.id}/${thread.id}`;

    interaction.guild.channels.cache
      .get(process.env.BOT_LOGGING)
      .send({ embeds: [embed] })
      .catch((err) => console.log("[TALKTO] Error with sending the embed."));

    await interaction.editReply({
      content: `Thread created and user role assigned. You can find the thread here: ${threadUrl}`,
      ephemeral: true,
    });
  },
};
