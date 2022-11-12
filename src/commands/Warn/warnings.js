const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const { default: mongoose } = require("mongoose");
const Warning = require("../../events/mongo/schema/warning");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warnings")
    .setDescription(
      "Retrive all the warnings for a set user from the database."
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User of whom you want the warnings.")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    if (interaction.member.roles.cache.has(process.env.MOD_ROLE_ID)) {
      const user = interaction.options.getUser("user");

      let findWarnings = await Warning.find({ userID: user.id });

      const warningsEmbed = new EmbedBuilder()
        .setAuthor({
          name: `${user.tag}'s Warnings`,
          iconURL: user.displayAvatarURL(),
        })
        .setTitle(`Total: ${findWarnings.length}`)
        .setColor("#000000");

      findWarnings.forEach((warning) => {
        warningsEmbed.addFields({
          name: `ID #${warning._id}`,
          value: `**Moderator:** ${interaction.guild.members.cache.get(
            warning.moderatorID
          )}\n${warning.date.toISOString()}\n**Reason:** \`${
            warning.reason
          }\``,
        });
      });

      interaction.reply({ embeds: [warningsEmbed] });
    } else {
      await interaction.reply({
        content: `Nice try! You are not a moderator`,
        ephemeral: true,
      });
    }
  },
};
