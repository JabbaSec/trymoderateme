const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

const Note = require("../../events/mongo/schema/note");
const Warning = require("../../events/mongo/schema/warning");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("delall")
    .setDescription("Deletes *all* warnings for a selected user *irreversible")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    //   .addUserOption((option) =>
    //   option
    //     .setName('user')
    //     .setDescription('User of whom is having a fresh slate.')
    //     .setRequired(true)
    // ),
    .addSubcommand((subcommand) =>
      subcommand
        .setName("warnings")
        .setDescription("Delete all warnings for a given user.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("User of whom is having a fresh slate.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("notes")
        .setDescription("Delete all notes for a given user.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("User of whom is having a fresh slate.")
            .setRequired(true)
        )
    ),
  async execute(interaction, client) {
    if (interaction.member.roles.cache.has(process.env.MOD_ROLE_ID)) {
      const user = interaction.options.getUser("user");

      if (interaction.options.getSubcommand() === "warnings") {
        findData = await Warning.deleteMany({ userID: user.id });
      } else {
        findData = await Note.deleteMany({ userID: user.id });
      }

      if (findData) {
        await interaction.reply({
          content: "All data has been successfully erased.",
        });
      } else {
        await interaction.reply({
          content: "That user does not have any corresponding data.",
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
