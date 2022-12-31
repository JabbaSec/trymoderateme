module.exports = {
  data: {
    name: "example-modal",
  },
  async execute(interaction, client) {
    await interaction.reply({
      content: `You selected option ${interaction.fields.getTextInputValue(
        "exampleModalInput"
      )}`,
    });
  },
};
