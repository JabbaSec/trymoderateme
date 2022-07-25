module.exports = {
    data: {
        name: 'ban-modal',
    },
    async execute(interaction, client) {
        await interaction.reply({content: `Reason for ban: ${interaction.fields.getTextInputValue('reasonModalInput')}`});
    }
}