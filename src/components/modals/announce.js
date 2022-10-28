module.exports = {
  data: {
    name: "announce-modal",
  },
  async execute(interaction, client) {
    await interaction.reply({
      content: "Done!",
    });

    interaction.guild.channels.cache.get(process.env.BOT_LOGGING).send({
      content: `${interaction.fields.getTextInputValue("modalDescription")}
        \nA new room has been released! Check it out: ${interaction.fields.getTextInputValue(
          "modalRoomURL"
        )}\n<@&1035262848756105297>`,
    });
  },
};
