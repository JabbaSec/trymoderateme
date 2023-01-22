const axios = require("axios");
const {
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: {
    name: "giveaway-modal",
  },
  async execute(interaction, client) {
    const amount = interaction.fields.getTextInputValue("modalWinnerAmount");
    const prizes = interaction.fields.getTextInputValue("modalPrizes").split('\n');

    const date = Math.round(
      new Date(interaction.fields.getTextInputValue("modalDuration")).getTime() /
        1000
    );

    const giveawayEmbed = new EmbedBuilder()
    .setColor("#00ff00")
    .setTitle(`Official TryHackMe Giveaway`)
    .setFields([
      {
        name: `When will it end? (your local time)`,
        value: `<t:${date}:f>`,
      },
      {
        name: `How many winners?`,
        value: `${amount}`
      }
    ]);

    prizes.forEach((prize) => {
      giveawayEmbed.addFields({
        name: `${prize}`,
        value: `\u200B`,
      });
    });

    const button = new ButtonBuilder()
      .setLabel("Join giveaway")
      .setCustomId("giveaway-join")
      .setStyle(ButtonStyle.Primary);

    await interaction.reply({ embeds: [giveawayEmbed],
      components: [new ActionRowBuilder().addComponents(button)],
    });
  },
};
