const { ActivityType } = require("discord.js");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`
████████╗██████╗░██╗░░░██╗███╗░░░███╗░█████╗░██████╗░███████╗██████╗░░█████╗░████████╗███████╗███╗░░░███╗███████╗██╗░░░██╗░░███╗░░
╚══██╔══╝██╔══██╗╚██╗░██╔╝████╗░████║██╔══██╗██╔══██╗██╔════╝██╔══██╗██╔══██╗╚══██╔══╝██╔════╝████╗░████║██╔════╝██║░░░██║░████║░░
░░░██║░░░██████╔╝░╚████╔╝░██╔████╔██║██║░░██║██║░░██║█████╗░░██████╔╝███████║░░░██║░░░█████╗░░██╔████╔██║█████╗░░╚██╗░██╔╝██╔██║░░
░░░██║░░░██╔══██╗░░╚██╔╝░░██║╚██╔╝██║██║░░██║██║░░██║██╔══╝░░██╔══██╗██╔══██║░░░██║░░░██╔══╝░░██║╚██╔╝██║██╔══╝░░░╚████╔╝░╚═╝██║░░
░░░██║░░░██║░░██║░░░██║░░░██║░╚═╝░██║╚█████╔╝██████╔╝███████╗██║░░██║██║░░██║░░░██║░░░███████╗██║░╚═╝░██║███████╗░░╚██╔╝░░███████╗
░░░╚═╝░░░╚═╝░░╚═╝░░░╚═╝░░░╚═╝░░░░░╚═╝░╚════╝░╚═════╝░╚══════╝╚═╝░░╚═╝╚═╝░░╚═╝░░░╚═╝░░░╚══════╝╚═╝░░░░░╚═╝╚══════╝░░░╚═╝░░░╚══════╝
`);

    console.log(`${client.user.tag} is ready!`);

    client.user.setActivity("The TryHackMe Discord server.", {
      type: ActivityType.Watching,
    });
  },
};
