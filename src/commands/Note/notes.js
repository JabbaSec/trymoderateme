const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const { default: mongoose } = require("mongoose");
const Note = require("../../events/mongo/schema/note");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("notes")
    .setDescription("Retrive all the notes for a set user from the database.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User of whom you want the notes.")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    if (interaction.member.roles.cache.has(process.env.MOD_ROLE_ID)) {
      const user = interaction.options.getUser("user");

      let findNotes = await Note.find({ userID: user.id });

      const notesEmbed = new EmbedBuilder()
        .setAuthor({
          name: `${user.tag}'s Notes`,
          iconURL: user.displayAvatarURL(),
        })
        .setTitle(`Total: ${findNotes.length}`)
        .setColor("#ffff00");

      findNotes.forEach((note) => {
        notesEmbed.addFields({
          name: `ID #${note._id}`,
          value: `**Moderator:** ${interaction.guild.members.cache.get(
            note.moderatorID
          )}\n**Note:** ${note.note}\n\`${note.date.toISOString()}\``,
        });
      });

      interaction.editReply({ embeds: [notesEmbed] });
    } else {
      await interaction.editReply({
        content: `Nice try! You are not a moderator`,
        ephemeral: true,
      });
    }
  },
};
