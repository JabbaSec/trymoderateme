const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  PermissionFlagsBits,
} = require("discord.js");

const axios = require("axios");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Check URLs")
    .setType(ApplicationCommandType.Message)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction, client) {
    if (interaction.member.roles.cache.has(process.env.MOD_ROLE_ID)) {
      const API_URL = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT}/urlscanner/scan`;
      const API_TOKEN = process.env.CLOUDFLARE_TOKEN;
      const HEADERS = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      };

      const urlRegex = /https?:\/\/[^\s]+/g;
      const message = await interaction.channel.messages.fetch(
        interaction.targetId
      );

      console.log(message.content);

      const urls = message.content.match(urlRegex);
      if (!urls) {
        await interaction.reply({
          content: "There are no URLs in that message.",
        });
        return;
      }

      for (const url of urls) {
        const submission = await axios.post(
          API_URL,
          { url },
          { headers: HEADERS }
        );

        const scanId = submission.data.result.uuid;

        let report;
        do {
          await new Promise((resolve) => setTimeout(resolve, 15000));

          report = await axios.get(`${API_URL}/${scanId}`, {
            headers: HEADERS,
          });
        } while (report.data.task && report.data.task.status !== "Finished");

        const embed = new MessageEmbed()
          .setTitle("URL Scan Report")
          .setDescription(`Report for ${url}`)
          .addField("Effective URL", report.data.task.effectiveUrl)
          .addField("Overall Malicious", report.data.verdicts.overall.malicious)
          .setColor("#0099ff");

        message.channel.send({ embeds: [embed] });

        await interaction.editReply({
          embeds: embed,
        });
      }
    } else {
      await interaction.editReply({
        content: `Nice try! You are not a moderator`,
        ephemeral: true,
      });
    }
  },
};
