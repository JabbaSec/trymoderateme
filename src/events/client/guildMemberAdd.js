const { default: mongoose } = require("mongoose");
const Mute = require("../mongo/schema/mute");
require("dotenv").config();

const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildMemberAdd",

  async execute(member) {
    let findMute = await Mute.findOne({ userID: member.id });

    if (findMute) {
      const mutedRole = member.guild.roles.cache.get(process.env.MUTED_ROLE_ID);
      member.roles.add(mutedRole);
    }
  },
};
