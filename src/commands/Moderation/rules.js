const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rules")
    .setDescription("Returns all the rules as separate embeds"),
  async execute(interaction, client) {
    rules = require(`./rules.json`);

    rules.forEach((rule) => {
      const ruleEmbed = new EmbedBuilder().setColor("#ffff00").setFields([
        {
          name: `Rule ${rule.id}`,
          value: `\`\`\`${rule.text}\`\`\``,
        },
      ]);

      interaction.guild.channels.cache
        .get(process.env.RULES)
        .send({ embeds: [ruleEmbed] });
    });
    await interaction.reply({ content: `Done!` });
  },
};
