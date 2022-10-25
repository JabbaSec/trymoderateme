const { InteractionType } = require("discord.js");

module.exports = {
  name: "interactionCreate",

  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const { commands } = client;
      const { commandName } = interaction;
      
      const command = commands.get(commandName);

      if (!command) return;

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "An error occurred while executing this command.",
          ephemeral: true,
        });
      }
    } else if (interaction.isButton()) {
      const { buttons } = client;
      const { customId } = interaction;

      const button = buttons.get(customId);

      if (!button) return new Error("There is no button with this custom ID.");

      try {
        await button.execute(interaction, client);
      } catch (error) {
        console.error(error);
      }
    } else if (interaction.isSelectMenu()) {
      const { dropdowns } = client;
      const { customId } = interaction;

      const dropdown = dropdowns.get(customId);

      if (!dropdown)
        return new Error("There is no dropdown with this custom ID.");

      try {
        await dropdown.execute(interaction, client);
      } catch (error) {
        console.error(error);
      }
    } else if (interaction.type == InteractionType.ModalSubmit) {
      const { modals } = client;
      const { customId } = interaction;

      const modal = modals.get(customId);

      if (!modal) return new Error("There is no modal with this custom ID.");

      try {
        await modal.execute(interaction, client);
      } catch (error) {
        console.error(error);
      }
    } else if (interaction.isContextMenuCommand()) {
      const { commands } = client;
      const { commandName } = interaction;

      const contextCommand = commands.get(commandName);

      if (!contextCommand) return;

      try {
        await contextCommand.execute(interaction, client);
      } catch (error) {
        console.error(error);
      }
    }
  },
};
