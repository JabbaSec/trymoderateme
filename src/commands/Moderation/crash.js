const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("crash").setDescription("Merp meep."),
  async execute(interaction, client) {
    const pingEmbed = new EmbedBuilder()
      .setTitle("Pong!")
      .setColor("#00ff00")
      .setThumbnail(client.user.displayAvatarURL())
      .setTimestamp(Date.now())
      .setFields([
        {
          name: "API Latency",
          value: `${client.ws.ping}ms`,
        },
        {
          name: "Client Latency",
          value: `${Date.now() - interaction.createdTimestamp}ms`,
        },
      ]);

    await interaction.reply({ embeds: [pingEmbed] });
  },
};
