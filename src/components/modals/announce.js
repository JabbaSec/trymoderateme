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
    const roomTitle = interaction.fields.getTextInputValue("modalRoomTitle");

    const url = "https://tryhackme.com/api/v2/hacktivities/extended-search";

    const params = {
      kind: "all",
      difficulty: "all",
      order: "relevance",
      roomType: "all",
      page: 1,
      searchText: `${roomTitle}`,
      userProgress: "all",
      limit: 1,
    };

    axios
      .get(url, { params })
      .then(async (response) => {
        console.log("API Response:", response.data);
        const docs = response.data.data.docs;

        if (!docs || docs.length === 0) {
          return interaction.reply({
            content: `No matching room found for title: \`${roomTitle}\``,
            ephemeral: true,
          });
        }

        let matchingRoom = null;

        for (const doc of docs) {
          console.log("Checking document:", doc);
          if (doc.code === roomCode) {
            matchingRoom = doc;
            break;
          }
        }

        if (!matchingRoom) {
          return interaction.reply({
            content: `No matching room found for code: \`${roomCode}\``,
            ephemeral: true,
          });
        }

        const roomDescription = matchingRoom.description;
        const roomFree = matchingRoom.freeToUse
          ? "Free Room!"
          : "Subscriber Only.";
        let imageUrl = matchingRoom.imageURL;
        [9 / 1841];
        const isChallengeRoom = matchingRoom.type === "challenge";

        const roomLink = isChallengeRoom
          ? `https://tryhackme.com/jr/${roomCode}?utm_campaign=cr_${roomCode}&utm_medium=social&utm_source=discord`
          : `https://tryhackme.com/jr/${roomCode}?utm_campaign=rr_${roomCode}&utm_medium=social&utm_source=discord`;

        let imageAttachment;

        if (imageUrl) {
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
        }

        const announceEmbed = new EmbedBuilder()
          .setTitle(`${matchingRoom.title}`)
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
          \nA new room has been released! Check it out: <${roomLink}>
          \n<@&${process.env.ANNOUNCEMENT_ROLE_ID}>`,
          embeds: [announceEmbed],
          ...(imageAttachment ? { files: [imageAttachment] } : {}),
        });

        await interaction.reply({
          content: "Announcement posted!",
          ephemeral: true,
        });
      })
      .catch((error) => {
        console.error("Error fetching room data:", error);
        interaction.reply({
          content: "There was an error fetching the room details.",
          ephemeral: true,
        });
      });
  },
};
