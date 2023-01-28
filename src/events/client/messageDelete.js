const { EmbedBuilder } = require("discord.js");
require("dotenv").config();

module.exports = {
  name: "messageDelete",

  async execute(message, client) {
    if (message.author.bot) return;

    const deleteEmbed = new EmbedBuilder()
      .setAuthor({
        name: `${message.author.tag}`,
        iconURL: message.author.displayAvatarURL(),
      })
      .setColor("#ff0000")
      .setThumbnail(`${message.author.displayAvatarURL()}`)
      .setTitle(`:wastebasket: Deleted Message`)
      .setFooter({ text: `${message.createdAt}` })
      .setFields([
        {
          name: `Channel`,
          value: `<#${message.channel.id}>`,
        },
      ]);

      const messageHadText = message.content;
      if (messageHadText) {
        deleteEmbed.addFields({
          name: `Message`,
          value: `${message.content}`,
        })
      }

      const messageHadAttachment = message.attachments.first()
      if (messageHadAttachment) deleteEmbed.setImage(messageHadAttachment.proxyURL)
  

    client.channels.cache
      .get(process.env.DELETED_MESSAGES)
      .send({ embeds: [deleteEmbed] })
      .catch((err) => console.log("[DELETE] Error with sending the embed."));
  },
};
