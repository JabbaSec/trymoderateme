const { Collection } = require("discord.js");

// Create a new collection for storing the old message content
const editedMessages = new Collection();

module.exports = {
  name: "messageUpdate",
  async execute(oldMessage, newMessage, client) {
    // Ignore messages from bots
    if (oldMessage.author.bot) return;

    // Store the old message content in the collection
    editedMessages.set(oldMessage.id, oldMessage.content);

    // Attach the collection to the client so it can be accessed in other events
    client.editedMessages = editedMessages;
  },
};
