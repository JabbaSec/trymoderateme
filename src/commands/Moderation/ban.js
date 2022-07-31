const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test-ban')
        .setDescription('Bans a user from the server.')
        .addUserOption(option => option.setName('user').setDescription('The member to ban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for ban'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction, client) {
        if (interaction.member.roles.cache.has(process.env.MOD_ROLE_ID)) {
            const user = interaction.options.getMember('user');
            const id = interaction.options.get('user')?.value;
            const reason = interaction.options.getString('reason') || 'No reason provided'

            try {
                if (!user.bannable) return interaction.reply({content: "I am having some trouble with banning this member.", ephemeral: true});

                const banEmbed = new EmbedBuilder()
                .setAuthor({name: `${interaction.options.getUser('user').tag} you have been banned.`, iconURL: `${user.displayAvatarURL()}`})
                .addFields(
                    {name: 'Moderator', value: `${interaction.guild.members.cache.get(interaction.user.id)}`},
                    {name: 'Reason', value: `${reason}`, inline: true},
                )
                .setFooter({text: `To appeal this ban, please email bans@tryhackme.com`})
                .setColor("#ff0000")

                await user.send({embeds: [banEmbed]}).then(() => {user.ban({reason: reason})}).catch(console.log);
                await interaction.reply({embeds: [banEmbed]})

                interaction.guild.channels.cache.get(process.env.BOT_LOGGING).send({embeds: [banEmbed]})
            } catch (error) {
                const banEmbed = new EmbedBuilder()
                .setAuthor({name: `${interaction.options.getUser('user').tag} you have been banned.`, iconURL: `${interaction.user.displayAvatarURL()}`})
                .addFields(
                    {name: 'Moderator', value: `${interaction.guild.members.cache.get(interaction.user.id)}`},
                    {name: 'Reason', value: `${reason}`, inline: true},
                )
                .setFooter({text: `To appeal this ban, please email bans@tryhackme.com`})
                .setColor("#ff0000")

                await interaction.guild.members.ban(id).then(() => {
                    interaction.reply({embeds: [banEmbed]});
                    interaction.guild.channels.cache.get(process.env.BOT_LOGGING).send({embeds: [banEmbed]})
                }).catch((error) => {console.log(error)});
            }
        } else {
            await interaction.reply({content: `Nice try. You are not a moderator.`, ephemeral: true});
        }
    }
}