const { InteractionType } = require("discord.js");

module.exports = {
  name: "interactionCreate",

  async execute(interaction, client) {
    const loggingChannel = interaction.guild?.channels.cache.get(
      process.env.BOT_LOGGING
    );

    try {
      if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        if (!interaction.guild) return;

        if (
          ["announce", "giveaway", "report"].includes(interaction.commandName)
        ) {
          await command.execute(interaction, client);
        } else {
          await interaction.deferReply();
          await command.execute(interaction, client);
        }
      } else if (interaction.isButton()) {
        const button = client.buttons.get(interaction.customId);
        if (!button) return;
        await button.execute(interaction, client);
      } else if (interaction.isStringSelectMenu()) {
        const dropdown = client.dropdowns.get(interaction.customId);
        if (!dropdown) return;
        await dropdown.execute(interaction, client);
      } else if (interaction.type === InteractionType.ModalSubmit) {
        const modal = client.modals.get(interaction.customId);
        if (!modal) return;
        await modal.execute(interaction, client);
      } else if (interaction.isContextMenuCommand()) {
        const contextCommand = client.commands.get(interaction.commandName);
        if (!contextCommand) return;
        await interaction.deferReply();
        await contextCommand.execute(interaction, client);
      }
    } catch (error) {
      console.log("Error encountered:", error);

      if (!interaction.replied && !interaction.deferred) {
        try {
          await interaction.reply({
            content:
              "An error occurred while executing this command. Please try again later.",
            ephemeral: true,
          });
        } catch (err) {
          console.log("Failed to reply to interaction:", err);
        }
      } else {
        try {
          await interaction.followUp({
            content:
              "An error occurred while executing this command. Please try again later.",
            ephemeral: true,
          });
        } catch (err) {
          console.log("Failed to follow up on interaction:", err);
        }
      }

      if (loggingChannel) {
        try {
          await loggingChannel.send({
            content: `<@270975958511517697> The bot encountered an error while handling an interaction. Please check the logs.`,
          });
        } catch (err) {
          console.log("Failed to send message to logging channel:", err);
        }
      }
    }
  },
};
