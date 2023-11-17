const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const Data = require("../../events/mongo/schema/data");
const Giveaway = require("../../events/mongo/schema/giveaway");
const { default: mongoose } = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stops the current giveaway.")
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
      for (let i = 0; i < parseInt(findGiveaway.amount); i++) {
        promises.push(chooseWinner());
      }

      Promise.all(promises).then((results) => {
        winners = results.map((result) => `\n<@${result.userID}>`);
        interaction.editReply({
          content: `Giveaway over! Congratulations to the winners:\n${winners}`,
        });
      });
    }
  },
};
