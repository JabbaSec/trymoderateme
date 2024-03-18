const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

const { default: mongoose } = require("mongoose");
const Mute = require("../../events/mongo/schema/mute");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Removes a mute from a user in the discord server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to be muted.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for muting the user.")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    if (
      interaction.member.roles.cache.has(
        process.env.MOD_ROLE_ID || process.env.TMOD_ROLE_ID
      )
    ) {
      const user = interaction.options.getUser("user");
      const reason = interaction.options.getString("reason");

      const mutedRole = interaction.guild.roles.cache.get(
        process.env.MUTED_ROLE_ID
      );
      const member = await interaction.guild.members.cache.get(user.id);

      if (member) {
        if (!member.bannable || null)
          return interaction.editReply({
            content: "I am having some trouble with muting this member.",
            ephemeral: true,
          });

        if (
          member.roles.highest.position >=
            interaction.member.roles.highest.position ||
          null
        )
          return interaction.editReply({
            content: "User's permissions are the same as or higher than yours.",
            ephemeral: true,
          });
      }

      if (!member) {
        return interaction.editReply({
          content: "I cannot find that user in the discord server.",
        });
      }

      const unmuteEmbed = new EmbedBuilder()
        .setAuthor({
          name: `${interaction.user.tag}`,
          iconURL: interaction.member.displayAvatarURL(),
        })
        .setColor("#00ff00")
        .setThumbnail(`${user.displayAvatarURL()}`)
        .setTitle(`:speaker: Unmuted ${user.tag} \n(${user.id})`)
        .setFields([
          {
            name: `Reason`,
            value: `${reason}`,
          },
        ]);

      let findMute = await Mute.findOne({ userID: user.id });

      if (findMute) {
        clearTimeout(findMute._id);
        member.roles.remove(mutedRole);

        findMute.delete();
      } else {
        return await interaction.editReply({
          content: `I cannot find a mute for the user \`${user.tag}\``,
        });
      }

      await interaction.editReply({
        content: `:speaker: ${user.tag} has been unmuted.`,
      });

      interaction.guild.channels.cache
        .get(process.env.BOT_LOGGING)
        .send({ embeds: [unmuteEmbed] })
        .catch((err) => console.log("[UNMUTE] Error with sending the embed."));

      await user
        .send({
          content: `:speaker: You have been unmuted!\nReason: ${reason}\n`,
        })
        .catch((err) =>
          interaction.followUp({ content: `[UNMUTE] I cannot DM that user.` })
        );
    } else {
      await interaction.editReply({
        content: `Nice try! You are not a moderator`,
        ephemeral: true,
      });
    }
  },
};
