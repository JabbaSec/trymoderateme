const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const { ObjectId } = require('mongodb');
const Note = require("../../events/mongo/schema/note");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("delnote")
    .setDescription("Deletes a note from the database *irreversible")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("ID of the note to be deleted.")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    if (interaction.member.roles.cache.has(process.env.MOD_ROLE_ID)) {
      const id = interaction.options.getString("id");

      if (ObjectId.isValid(id)) {
        let findNote = await Note.findOneAndDelete({ _id: id });
        if (findNote) {
          await interaction.reply({ content: "Note has been removed successfully." });
        } else {
          await interaction.reply({
            content: "Could not find a note with that ID.",
            ephemeral: true,
          });
        }
      } else {
        await interaction.reply({content: "That ID does not seem to be correct. Did you copy it right?", ephemeral: true,})
      }
    } else {
      await interaction.reply({
        content: `Nice try! You are not a moderator`,
        ephemeral: true,
      });
    }
  },
};
