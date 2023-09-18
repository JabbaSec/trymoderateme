const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

const axios = require("axios");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Check URLs")
    .setType(ApplicationCommandType.Message),
  async execute(interaction, client) {
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
      await interaction.editReply({
        content: "There are no URLs in that message.",
        ephemeral: true,
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
        console.log(report.data.messages[0].message);
      } while (report.data.messages[0].message !== "OK");

      const embed = new EmbedBuilder()
        .setTitle("URL Scan Report")
        .setDescription(`Report for ${url}`)
        .setFields([
          {
            name: "Malicious?",
            value: `${report.data.result.scan.verdicts.overall.malicious.toString()}`,
          },
        ])
        .setColor("#0099ff");

      await interaction.editReply({
        embeds: [embed],
      });
    }
  },
};
