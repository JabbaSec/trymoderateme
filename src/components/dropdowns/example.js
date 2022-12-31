module.exports = {
  data: {
    name: "example-dropdown",
    description: "This is an example dropdown.",
  },
  async execute(interaction, client) {
    await interaction.reply({
      content: `You have selected: ${interaction.values[0]}`,
    });
  },
};
