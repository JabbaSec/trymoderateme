const axios = require("axios");
const {
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const Giveaway = require("../../events/mongo/schema/giveaway");
const Data = require("../../events/mongo/schema/data");
const { default: mongoose } = require("mongoose");

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

    let findGiveaway = await Data.findOne({});

    if (findGiveaway) {
      clearTimeout(findGiveaway.id);
      Giveaway.deleteMany({})
      findGiveaway.delete();
    }

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

    const dButton = new ButtonBuilder()
      .setLabel("Join giveaway")
      .setCustomId("giveaway-join")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true);

      async function chooseWinner() {
        const count = await Giveaway.count().exec();
        const random = Math.floor(Math.random() * count);
        const result = await Giveaway.findOneAndDelete().skip(random).exec();
        return result;
      }

      var delay = date.getTime() - Date.now();
      var timerId = setTimeout(() => {
        const promises = [];
        for (let i = 0; i < parseInt(amount); i++) {
          promises.push(chooseWinner());
        }

        interaction.editReply({embed: [giveawayEmbed], components: [new ActionRowBuilder().addComponents(dButton)]});

        Promise.all(promises).then((results) => {
          winners = results.map((result) => `\n<@${result.userID}>`);
          interaction.followUp({ content: `Giveaway over! Congratulations to the winners:\n${winners}` });
        });
      }, delay);

      newData = await new Data({
        _id: mongoose.Types.ObjectId(),
        id: timerId,
        length: delay,
        amount: amount,
      });

      await newData.save().catch(console.error);

    await interaction.reply({ embeds: [giveawayEmbed],
      components: [new ActionRowBuilder().addComponents(button)],
    });
  },
};
