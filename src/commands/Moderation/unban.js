const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Select a member and revoke their ban.')
        .addUserOption(option => option.setName('id').setDescription('The user ID to unban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for unban'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction, client) {
        if (interaction.member.roles.cache.has(process.env.MOD_ROLE_ID)) {
            const id = interaction.options.get('id')?.value;
            const reason = interaction.options.getString('reason') || 'No reason provided'
            
            const unbanEmbed = new EmbedBuilder()
                .setAuthor({name: `${interaction.options.getUser('id').tag} has been unbanned`})
                .addFields(
                    {name: 'Moderator', value: `${interaction.guild.members.cache.get(interaction.user.id)}` || 'Unknown#0000'},
                    {name: 'Reason', value: `${reason}`, inline: true})
                .setColor("#00ff00")

            await interaction.guild.members.unban(id).then(() => {
                interaction.reply({embeds: [unbanEmbed]});
                interaction.guild.channels.cache.get(process.env.BOT_LOGGING).send({embeds: [unbanEmbed]});
            }).catch(() => {
                interaction.reply({content: `${interaction.options.getUser('id').tag} is not banned.`, ephemeral: true});
            });
        } else {
            await interaction.reply({content: `Nice try. You are not a moderator.`, ephemeral: true});
        }
    }
}