module.exports = {
  data: {
    name: "example-button",
  },

  async execute(interaction, client) {
    await interaction.editReply({ content: "This is an example button." });
  },
};
