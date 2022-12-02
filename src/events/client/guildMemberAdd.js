const { default: mongoose } = require("mongoose");
const Mute = require("../mongo/schema/mute");
require("dotenv").config();

const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildMemberAdd",

  async execute(member, interaction) {
    let findMute = await Mute.find({ userID: member.id });
    const mutedRole = member.guild.roles.cache.get(process.env.MUTED_ROLE_ID);

    const unmuteEmbed = new EmbedBuilder()
      .setColor("#00ff00")
      .setThumbnail(`${member.displayAvatarURL()}`)
      .setTitle(`:speaker: Unmuted ${member.tag} \n(${member.id})`)
      .setFields([
        {
          name: `Reason`,
          value: `Time expired`,
        },
      ]);

    if (findMute) {
      console.log(`${member.tag} tried to evade a mute.`);

      member.roles.add(mutedRole);
    }
  },
};
