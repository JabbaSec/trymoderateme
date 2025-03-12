const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

const mongoose = require("mongoose");
const Report = require("../../events/mongo/schema/report");

const MAX_REASON_LENGTH = 200;
const DISCORD_MESSAGE_LINK_REGEX =
  /^https?:\/\/(discord(app)?\.com)\/channels\/\d+\/\d+\/\d+$/;
const cooldowns = new Map(); // In-memory cooldown tracking
const COOLDOWN_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds
const alertCooldown = new Map(); // Cooldown for @here mentions
const ALERT_COOLDOWN_DURATION = 2 * 60 * 1000; // 2 minutes in milliseconds

module.exports = {
  data: new SlashCommandBuilder()
    .setName("report")
    .setDescription("Report a user or message to the moderators.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("user")
        .setDescription("Report a user for misconduct.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to report.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("Reason for the report.")
            .setMaxLength(MAX_REASON_LENGTH)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("message")
        .setDescription("Report a specific message.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The author of the message.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("message_link")
            .setDescription("The link to the message.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("Reason for the report.")
            .setMaxLength(MAX_REASON_LENGTH)
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const reportChannel = interaction.guild.channels.cache.get(
      process.env.REPORTS
    );

    if (!reportChannel) {
      return interaction.reply({
        content: "Error: Could not find the report channel.",
        ephemeral: true,
      });
    }

    const reporter = interaction.user;
    const verifiedRoleId = process.env.VERIFIED_ROLE_ID;

    // Check if user is verified
    if (!interaction.member.roles.cache.has(verifiedRoleId)) {
      return interaction.reply({
        content:
          "You must verify your account before you can use the report command, [learn more](https://help.tryhackme.com/en/articles/6495858-discord-how-do-i-verify-my-tryhackme-account)",
        ephemeral: true,
      });
    }

    const now = Date.now();

    // Check cooldown
    if (cooldowns.has(reporter.id)) {
      const lastUsed = cooldowns.get(reporter.id);
      const cooldownExpires = Math.floor((lastUsed + COOLDOWN_DURATION) / 1000);
      if (now - lastUsed < COOLDOWN_DURATION) {
        return interaction.reply({
          content: `You can use this command again <t:${cooldownExpires}:R>.`,
          ephemeral: true,
        });
      }
    }

    const timestamp = Math.floor(Date.now() / 1000);

    if (subcommand === "user") {
      const reportedUser = interaction.options.getUser("user");
      const reason = interaction.options.getString("reason");

      cooldowns.set(reporter.id, now);
      setTimeout(() => cooldowns.delete(reporter.id), COOLDOWN_DURATION);

      let mention = "";
      if (
        !alertCooldown.has(reportChannel.id) ||
        now - alertCooldown.get(reportChannel.id) > ALERT_COOLDOWN_DURATION
      ) {
        mention = "@here";
        alertCooldown.set(reportChannel.id, now);
        setTimeout(
          () => alertCooldown.delete(reportChannel.id),
          ALERT_COOLDOWN_DURATION
        );
      }

      const reportEmbed = new EmbedBuilder()
        .setAuthor({
          name: `${reporter.tag}`,
          iconURL: reporter.displayAvatarURL(),
        })
        .setColor("#ff0000")
        .setThumbnail(`${reportedUser.displayAvatarURL()}`)
        .setTitle(`🚨 User Report: \`${reportedUser.tag}\``)
        .setFields([
          {
            name: "Reporter",
            value: `\`${reporter.tag}\` (${reporter.id})`,
            inline: true,
          },
          {
            name: "Reported User",
            value: `\`${reportedUser.tag}\` (${reportedUser.id})`,
            inline: true,
          },
          {
            name: "Channel",
            value: `<#${interaction.channel.id}>`,
            inline: true,
          },
          { name: "Reason", value: `\`${reason}\`` },
          { name: "Timestamp", value: `<t:${timestamp}:F>` },
        ]);

      await reportChannel.send({ content: mention, embeds: [reportEmbed] });

      return interaction.reply({
        content: "Your report has been submitted to the moderators.",
        ephemeral: true,
      });
    }

    if (subcommand === "message") {
      const reportedUser = interaction.options.getUser("user");
      const messageLink = interaction.options.getString("message_link");
      const reason = interaction.options.getString("reason");

      if (!DISCORD_MESSAGE_LINK_REGEX.test(messageLink)) {
        return interaction.reply({
          content:
            "Invalid message link! Please provide a **valid Discord message link.**",
          ephemeral: true,
        });
      }

      cooldowns.set(reporter.id, now);
      setTimeout(() => cooldowns.delete(reporter.id), COOLDOWN_DURATION);

      let mention = "";
      if (
        !alertCooldown.has(reportChannel.id) ||
        now - alertCooldown.get(reportChannel.id) > ALERT_COOLDOWN_DURATION
      ) {
        mention = "@here";
        alertCooldown.set(reportChannel.id, now);
        setTimeout(
          () => alertCooldown.delete(reportChannel.id),
          ALERT_COOLDOWN_DURATION
        );
      }

      const reportEmbed = new EmbedBuilder()
        .setAuthor({
          name: `${reporter.tag}`,
          iconURL: reporter.displayAvatarURL(),
        })
        .setColor("#ff0000")
        .setThumbnail(reportedUser.displayAvatarURL())
        .setTitle(`🚨 Message Report: \`${reportedUser.tag}\``)
        .setFields([
          {
            name: "Reporter",
            value: `\`${reporter.tag}\` (${reporter.id})`,
            inline: true,
          },
          {
            name: "Reported User",
            value: `\`${reportedUser.tag}\` (${reportedUser.id})`,
            inline: true,
          },
          {
            name: "Channel",
            value: `<#${interaction.channel.id}>`,
            inline: true,
          },
          {
            name: "Message",
            value: `${messageLink}`,
            inline: true,
          },
          { name: "Reason", value: `\`${reason}\`` },
          { name: "Timestamp", value: `<t:${timestamp}:F>` },
        ]);

      await reportChannel.send({ content: mention, embeds: [reportEmbed] });

      return interaction.reply({
        content: "Your report has been submitted to the moderators.",
        ephemeral: true,
      });
    }
  },
};
