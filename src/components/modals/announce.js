const axios = require("axios");
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: {
    name: "announce-modal",
  },
  async execute(interaction, client) {
    const roomCode = interaction.fields.getTextInputValue("modalRoomCode");

    axios
      .get(`https://tryhackme.com/api/room/details?codes=${roomCode}`)
      .then(async (response) => {
        const roomDescription = response.data[roomCode].description;
        const roomFree = response.data[roomCode].freeToUse
          ? "Free Room!"
          : "Subscriber Only.";
        let imageUrl = response.data[roomCode].image;

        let imageAttachment;

        if (imageUrl.endsWith(".svg")) {
          try {
            const imageResponse = await axios.get(imageUrl, {
              responseType: "arraybuffer",
            });
            const svgBuffer = Buffer.from(imageResponse.data, "utf-8");

            const pngBuffer = await sharp(svgBuffer).png().toBuffer();

            const pngFilePath = path.join(__dirname, "room.png");
            await fs.promises.writeFile(pngFilePath, pngBuffer);

            imageAttachment = new AttachmentBuilder(pngFilePath, {
              name: "room.png",
            });
          } catch (error) {
            console.error("Error converting SVG to PNG: ", error);
          }
        }

        const announceEmbed = new EmbedBuilder()
          .setTitle(`${response.data[roomCode].title}`)
          .setDescription(`${roomDescription}`)
          .setColor("#000000")
          .setFooter({ text: `${roomFree}` });

        if (imageAttachment) {
          announceEmbed.setImage(`attachment://room.png`);
        } else {
          announceEmbed.setImage(imageUrl);
        }

        interaction.guild.channels.cache.get(process.env.ANNOUNCEMENTS).send({
          content: `${interaction.fields.getTextInputValue("modalTitle")}
          \nA new room has been released! Check it out: <https://tryhackme.com/jr/${roomCode}>
          \n<@&${process.env.ANNOUNCEMENT_ROLE_ID}>`,
          embeds: [announceEmbed],
          ...(imageAttachment ? { files: [imageAttachment] } : {}),
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
