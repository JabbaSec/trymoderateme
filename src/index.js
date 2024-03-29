require("dotenv").config();
const { connect } = require("mongoose");

const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();
client.buttons = new Collection();
client.dropdowns = new Collection();
client.modals = new Collection();
client.commandArray = [];

const functionFolders = fs.readdirSync("./src/functions/");
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));

  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`)(client);
}

client.handleEvents();
client.handleCommands();
client.handleComponents();

client.login(process.env.DISCORD_TOKEN);

(async () => {
  connect("mongodb://127.0.0.1:27017/").catch(console.error);
})();
