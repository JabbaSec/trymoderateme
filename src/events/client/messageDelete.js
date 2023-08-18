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
        value: `${message.content.substring(0, 1023)}`,
      });
    }

    const messageHadAttachment = message.attachments.first();
    if (messageHadAttachment) {
      deleteEmbed.setImage(messageHadAttachment.proxyURL);
      deleteEmbed.addFields({
        name: `Attachment URL:`,
        value: `${messageHadAttachment.proxyURL}`,
      });
    }

    // Check if the message was edited before deletion
    // if (client.editedMessages && client.editedMessages.has(message.id)) {
    //   deleteEmbed.addFields({
    //     name: `Original Message`,
    //     value: `${client.editedMessages.get(message.id).substring(0, 1023)}`,
    //   });

    //   // Remove the entry from the collection
    //   client.editedMessages.delete(message.id);
    // }

    client.channels.cache
      .get(process.env.DELETED_MESSAGES)
      .send({ embeds: [deleteEmbed] })
      .catch((err) => console.log("[DELETE] Error with sending the embed."));
  },
};
