module.exports = {
  data: {
    name: "example-button",
  },

  async execute(interaction, client) {
    await interaction.reply({ content: "This is an example button." });
  },
};
