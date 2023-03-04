const axios = require("axios");
const {
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const Giveaway = require("../../events/mongo/schema/giveaway");

var winners = [];

module.exports = {
  data: {
    name: "giveaway-modal",
  },
  async execute(interaction, client) {
    const amount = interaction.fields.getTextInputValue("modalWinnerAmount");
    const prizes = interaction.fields.getTextInputValue("modalPrizes").split('\n');
    const description = interaction.fields.getTextInputValue("modalDescription");
    const date = new Date(interaction.fields.getTextInputValue("modalDuration"));

    const giveawayEmbed = new EmbedBuilder()
    .setColor("#00ff00")
    .setTitle(`Official TryHackMe Giveaway`)
    .setFields([
      {
        name: '\u200B',
        value: `${description}`
      },
      {
        name: `When will it end? (your local time)`,
        value: `<t:${Math.round(date.getTime() / 1000)}:f>`,
      },
      {
        name: `How many winners?`,
        value: `${amount}`
      }
    ]);

    prizes.forEach((prize, i) => {
      giveawayEmbed.addFields({
        name: `Prize #${i+1}`,
        value: `${prize}`,
      });
    });

    const button = new ButtonBuilder()
      .setLabel("Join giveaway")
      .setCustomId("giveaway-join")
      .setStyle(ButtonStyle.Primary);

      async function chooseWinner() {
        const count = await Giveaway.count().exec();
        const random = Math.floor(Math.random() * count);
        const result = await Giveaway.findOne().skip(random).exec();
        return result;
      }

      var delay = date.getTime() - Date.now();
      var timerId = setTimeout(() => {
        console.log(1)
        const promises = [];
        for (let i = 0; i < parseInt(amount); i++) {
          promises.push(chooseWinner());
        }

        Promise.all(promises).then((results) => {
          winners = results.map((result) => result.userID);
          interaction.followUp({ content: `Winner Winner Chicken Dinner ${winners}` });
        });
      }, delay);

    await interaction.reply({ embeds: [giveawayEmbed],
      components: [new ActionRowBuilder().addComponents(button)],
    });
  },
};
