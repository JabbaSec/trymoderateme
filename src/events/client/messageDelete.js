const { EmbedBuilder } = require("discord.js");
require("dotenv").config();

module.exports = {
  name: "messageDelete",

  async execute(message, client) {
    if (message.author.bot) return;

    return;

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
        {
          name: `Message`,
          value: `${message.content}`,
        },
      ]);

    client.channels.cache
      .get(process.env.BOT_LOGGING)
      .send({ embeds: [deleteEmbed] })
      .catch((err) => console.log("[DELETE] Error with sending the embed."));
  },
};
