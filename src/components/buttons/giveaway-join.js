const { default: mongoose } = require("mongoose");
const Giveaway = require("../../events/mongo/schema/giveaway");

module.exports = {
  data: {
    name: "giveaway-join",
  },

  async execute(interaction, client) {
    let findUser = await Giveaway.findOne({ userID: interaction.user.id });

    if (findUser) {
      return interaction.reply({
        content: `${interaction.user} you have already been entered into the giveaway.`,
        ephemeral: true,
      });
    }

    newGiveaway = await new Giveaway({
      _id: mongoose.Types.ObjectId(),
      userID: interaction.user.id,
    });

    await newGiveaway.save().catch(console.error);

    await interaction.reply({
      content: `${interaction.user} you have been entered into the giveaway! Good luck :)`,
      ephemeral: true,
    });
  },
};
