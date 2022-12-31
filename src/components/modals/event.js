const axios = require("axios");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    name: "event-modal",
  },
  async execute(interaction, client) {
    const title = interaction.fields.getTextInputValue("modalTitle");
    const description =
      interaction.fields.getTextInputValue("modalDescription");
    const date = Math.round(
      new Date(interaction.fields.getTextInputValue("modalDate")).getTime() /
        1000
    );

    interaction.guild.channels.cache.get(process.env.ANNOUNCEMENTS).send({
      content: `${title}
        \n${description}
        \nWhen will the event take place? <t:${date}:f> (this is your local time!)
        \n<@&${process.env.ANNOUNCEMENT_ROLE_ID}>`,
    });

    await interaction.editReply({
      content: "Done!",
    });
  },
};
