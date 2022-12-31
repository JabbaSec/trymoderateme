const axios = require("axios");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    name: "announce-modal",
  },
  async execute(interaction, client) {
    const roomCode = interaction.fields.getTextInputValue("modalRoomCode");

    axios
      .get(`https://tryhackme.com/api/room/details?codes=${roomCode}`)
      .then((response) => {
        const roomDescription = response.data[roomCode].description;
        const roomFree = response.data[roomCode].freeToUse
          ? "Free Room!"
          : "Subscriber Only.";

        const announceEmbed = new EmbedBuilder()
          .setTitle(`${response.data[roomCode].title}`)
          .setDescription(`${roomDescription}`)
          .setColor("#000000")
          .setImage(response.data[roomCode].image)
          .setFooter({ text: `${roomFree}` });

        interaction.guild.channels.cache.get(process.env.ANNOUNCEMENTS).send({
          content: `${interaction.fields.getTextInputValue("modalTitle")}
          \nA new room has been released! Check it out: <https://tryhackme.com/jr/${roomCode}>
          \n<@&${process.env.ANNOUNCEMENT_ROLE_ID}>`,
          embeds: [announceEmbed],
        });
      })
      .catch((error) => {
        console.log(error);
      });

    await interaction.reply({
      content: "Done!",
    });
  },
};
