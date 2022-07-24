const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Returns client and API latency.'),
    async execute(interaction, client) {
        const message = await interaction.deferReply({
            fetchReply: true
        });

        await interaction.editReply({
            content: `API Latency: ${client.ws.ping}ms\nClient Latency: ${message.createdTimestamp - interaction.createdTimestamp}ms`
        });
    }
}