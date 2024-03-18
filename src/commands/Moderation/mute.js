const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

const { default: mongoose } = require("mongoose");
const Mute = require("../../events/mongo/schema/mute");

const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Temporarily mutes a user in the Discord server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to be muted.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("duration")
        .setDescription(
          "The length of time that the user will be muted for (1d/ 1h/ 1m)."
        )
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
      interaction.member.roles.cache.has(process.env.MOD_ROLE_ID) ||
      interaction.member.roles.cache.has(process.env.TMOD_ROLE_ID)
    ) {
      const user = interaction.options.getUser("user");
      const reason = interaction.options.getString("reason");
      const duration = interaction.options.getString("duration");

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

      const muteEmbed = new EmbedBuilder()
        .setAuthor({
          name: `${interaction.user.tag}`,
          iconURL: interaction.member.displayAvatarURL(),
        })
        .setColor("#ff0000")
        .setThumbnail(`${user.displayAvatarURL()}`)
        .setTitle(`:mute: Muted ${user.tag} \n(${user.id})`)
        .setFooter({
          text: `Duation: ${ms(ms(duration), { long: true })}`,
        })
        .setFields([
          {
            name: `Reason`,
            value: `${reason}`,
          },
        ]);

      const unmuteEmbed = new EmbedBuilder()
        .setColor("#00ff00")
        .setThumbnail(`${user.displayAvatarURL()}`)
        .setTitle(`:speaker: Unmuted ${user.tag} \n(${user.id})`)
        .setFields([
          {
            name: `Reason`,
            value: `Time expired`,
          },
        ]);

      const leftEmbed = new EmbedBuilder()
        .setColor("#ff0000")
        .setThumbnail(`${user.displayAvatarURL()}`)
        .setTitle(`:door: ${user.tag} has left during a mute\n(${user.id})`)
        .setFields([
          {
            name: `Reason`,
            value: `Time expired`,
          },
        ]);

      let findMute = await Mute.findOne({ userID: user.id });

      if (findMute) {
        clearTimeout(findMute._id);

        findMute.delete();
      }

      member.roles.add(mutedRole);

      var timerId = setTimeout(async () => {
        member.roles.remove(mutedRole).catch((err) =>
          interaction.guild.channels.cache
            .get(process.env.BOT_LOGGING)
            .send({ embeds: [leftEmbed] })
            .catch((err) =>
              console.log("[MUTE] Error with sending the left embed.")
            )
        );

        let removeMute = await Mute.findOneAndDelete({ userID: user.id });

        interaction.guild.channels.cache
          .get(process.env.BOT_LOGGING)
          .send({ embeds: [unmuteEmbed] })
          .catch((err) => console.log("[MUTE] Error with sending the embed."));
      }, ms(`${duration}`));

      newMute = await new Mute({
        _id: timerId,
        userID: user.id,
        length: ms(`${duration}`),
        date: Date.now(),
      });

      await newMute.save().catch(console.error);

      await interaction.editReply({
        content: `:mute: ${user.tag} has been muted.`,
      });

      interaction.guild.channels.cache
        .get(process.env.BOT_LOGGING)
        .send({ embeds: [muteEmbed] })
        .catch((err) => console.log("[MUTE] Error with sending the embed."));

      await user
        .send({
          content: `:mute: You have been muted!\nReason: ${reason}\nDuration: ${ms(
            ms(duration, { long: true })
          )}\nIf you think this was a mistake, please contact a TryHackMe discord administrator.`,
        })
        .catch((err) =>
          interaction.followUp({ content: `[MUTE] I cannot DM that user.` })
        );
    } else {
      await interaction.editReply({
        content: `Nice try! You are not a moderator`,
        ephemeral: true,
      });
    }
  },
};
