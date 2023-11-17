const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

const Data = require("../../events/mongo/schema/data");
const Giveaway = require("../../events/mongo/schema/giveaway");
const { default: mongoose } = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reroll")
    .setDescription("Choose another winner for the Giveaway")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction, client) {
    let findGiveaway = await Data.findOne({});

    async function chooseWinner() {
      const count = await Giveaway.count().exec();
      const random = Math.floor(Math.random() * count);
      const result = await Giveaway.findOneAndDelete().skip(random).exec();
      return result;
    }

    if (findGiveaway) {
      clearTimeout(findGiveaway.id);

      const promises = [];
      for (let i = 0; i < parseInt(1); i++) {
        promises.push(chooseWinner());
      }

      Promise.all(promises).then((results) => {
        winners = results.map((result) => `\n<@${result.userID}>`);
        interaction.editReply({
          content: `Rerolled! Here is a new winner:\n${winners}`,
        });
      });
    }
  },
};
