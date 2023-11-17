const axios = require("axios");
const {
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("translate")
    .setDescription("Translate a text")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("The text to translate")
        .setRequired(true)
    ),
  async execute(interaction) {
    const text = interaction.options.getString("text");
    const translatedText = await translate(text);
    await interaction.editReply({
      content: `Translated text: ${translatedText}`,
    });
  },
};

async function translate(text) {
  const response = await axios.post("https://libretranslate.de/translate", {
    q: text,
    source: "auto",
    target: "en",
  });

  return response.data.translatedText;
}
