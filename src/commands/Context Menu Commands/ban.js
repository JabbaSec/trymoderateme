const { ContextMenuCommandBuilder, ApplicationCommandType, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('ban')
        .setType(ApplicationCommandType.User),
    async execute(interaction, client) {
        const modal = new ModalBuilder()
            .setCustomId('ban-modal')
            .setTitle('Ban User');

        const textInput = new TextInputBuilder()
            .setCustomId('reasonModalInput')
            .setLabel('Reason for ban')
            .setStyle(TextInputStyle.Paragraph);

        modal.addComponents(new ActionRowBuilder().addComponents(textInput));

        await interaction.showModal(modal);
    }
}