const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const { ObjectId } = require("mongodb");
const Warning = require("../../events/mongo/schema/warning");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("delwarn")
    .setDescription("Deletes a warning from the database *irreversible")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("ID of the warning to be deleted.")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    if (interaction.member.roles.cache.has(process.env.MOD_ROLE_ID)) {
      const id = interaction.options.getString("id");

      if (ObjectId.isValid(id)) {
        let findWarning = await Warning.findOneAndDelete({ _id: id });
        if (findWarning) {
          await interaction.reply({
            content: "Warning has been removed successfully.",
          });
        } else {
          await interaction.reply({
            content: "Could not find a warning with that ID.",
            ephemeral: true,
          });
        }
      } else {
        await interaction.reply({
          content:
            "That ID does not seem to be correct. Did you copy it right?",
          ephemeral: true,
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
