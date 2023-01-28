const { EmbedBuilder } = require("discord.js");
require("dotenv").config();

module.exports = {
  name: "messageUpdate",

  async execute(oldMessage, newMessage, client) {
    if (oldMessage.author.bot) return;

    if (oldMessage.content.replace(/[&\/\\#,+()$~%.'":*?<>{}\s+]/g, '') == newMessage.content.replace(/[&\/\\#,+()$~%.'":*?<>{}\s+]/g, '')) return;

    const editEmbed = new EmbedBuilder()
      .setAuthor({
        name: `${newMessage.author.tag}`,
        iconURL: newMessage.author.displayAvatarURL(),
      })
      .setColor("#ffa500")
      .setThumbnail(`${newMessage.author.displayAvatarURL()}`)
      .setTitle(`:recycle: Edited Message`)
      .setFooter({ text: `${newMessage.createdAt}` })
      .setFields([
        {
          name: `Channel`,
          value: `<#${newMessage.channel.id}>`,
        },
        {
          name: `Original Message`,
          value: `${oldMessage.content}`,
        },
        {
          name: `Edited Message`,
          value: `${newMessage.content}`,
        },
      ]);

    client.channels.cache
      .get(process.env.DELETED_MESSAGES)
      .send({ embeds: [editEmbed] })
      .catch((err) => console.log("[EDIT] Error with sending the embed."));
  },
};
