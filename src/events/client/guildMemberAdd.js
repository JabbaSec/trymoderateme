const { default: mongoose } = require("mongoose");
const Mute = require("../mongo/schema/mute");
require("dotenv").config();

const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildMemberAdd",

  async execute(member, interaction) {
    let findMute = await Mute.findOne({ userID: member.id });

    if (findMute) {
      console.log(findMute);
      const mutedRole = member.guild.roles.cache.get(process.env.MUTED_ROLE_ID);

      console.log(`${member.tag} tried to evade a mute.`);
      member.roles.add(mutedRole);
    }
  },
};
