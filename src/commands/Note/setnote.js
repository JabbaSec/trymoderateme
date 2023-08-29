const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const { default: mongoose } = require("mongoose");
const Note = require("../../events/mongo/schema/note");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setnote")
    .setDescription("Set a note on a user.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to store the note for.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("note").setDescription("Note details.").setRequired(true)
    ),
  async execute(interaction, client) {
    if (interaction.member.roles.cache.has(process.env.MOD_ROLE_ID)) {
      const user = interaction.options.getUser("user");
      const note = interaction.options.getString("note");

      newNote = await new Note({
        _id: mongoose.Types.ObjectId(),
        userID: user.id,
        moderatorID: interaction.member.id,
        note: note,
        date: Date.now(),
      });

      await newNote.save().catch(console.error);

      const noteEmbed = new EmbedBuilder()
        .setAuthor({
          name: `${interaction.user.tag}`,
          iconURL: interaction.member.displayAvatarURL(),
        })
        .setColor("#ffff00")
        .setThumbnail(`${user.displayAvatarURL()}`)
        .setTitle(`:pencil2: Note (${user.id})`)
        .setFooter({ text: `${newNote._id}` })
        .setFields([
          {
            name: `${user.tag}`,
            value: `${note}`,
          },
        ]);

      interaction.guild.channels.cache
        .get(process.env.BOT_LOGGING)
        .send({ embeds: [noteEmbed] })
        .catch((err) => console.log("[NOTES] Error with sending embed."));

      await interaction.editReply({
        content: `Note has successfully been added to ${user.tag}.`,
      });

      console.log(newNote);
    } else {
      await interaction.editReply({
        content: `Nice try! You are not a moderator`,
        ephemeral: true,
      });
    }
  },
};
