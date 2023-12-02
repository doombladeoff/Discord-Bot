const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionsBitField, Channel, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const moment = require('moment');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("info_user")
        .setDefaultMemberPermissions(PermissionsBitField.Administrator)
        .setDescription("Информация о пользователе")
        .addUserOption((option) => {
            return option
            .setName('target')
            .setDescription('Пользователь')
            .setRequired(true)
        }),
    run: async (client, interaction) => {
        try {
            //GET USER INFO
            const target = interaction.options.getUser('target')
            const guild = client.guilds.cache.get(`${interaction.guild.id}`);
            const member = await guild.members.fetch(target.id)
            //console.log(member)

            const embed_info = new EmbedBuilder()
                .setTitle(`Информация о пользователе ${member.user.username}.`)
                .setThumbnail(`${member.displayAvatarURL({ dynamic: true })}`)
                .addFields(
                    { name: 'Nickname:', value: `${member.user.username}`, inline: true},
                    { name: 'Tag:', value: `${member.user.tag}`, inline: true},
                    { name: 'ID:', value: `\`\`\`${member.id}\`\`\``, inline: true},
                    { name: 'Guild nickname:', value: `${member.displayName}`, inline: true},
                    { name: 'User joined:', value: `${moment.utc(member.joinedAt).format('YYYY-MM-DD')}`, inline: true},
                    { name: 'BOT:', value: `${member.user.bot ? '✅' : '❌'}`, inline: true},
                    { name:'Роли:', value: member.roles.cache.map(r => `${r}`).join(' | ')},
                    )

            if(member.user.bot){
                embed_info
                    .addFields({ name: 'Verified:', value: `${member.user.verified ? '✅' : '❌'}`, inline: true})
                }
            if(!member.user.bot){
                embed_info
                    .addFields({ name: 'Global name:', value: `${member.user.globalName}`, inline: true})
                }

                let statusUser = 'null';
                if(member.presence == null) {
                    statusUser = '⚫ Offline';
                } else {
                    switch(member.presence.status){
                        case null:
                            statusUser = '⚫ Offline'
                            break;
                        case 'online':
                            statusUser = '🟢 Online'
                            break;
                        case 'offline':
                            statusUser = '⚫ Offline'
                            break;
                        case 'idle':
                            statusUser = '🟠 Idle'
                            break;
                        case 'dnd':
                            statusUser = '🔴 Dnd'
                            break;
                    }
                }

                embed_info
                    .addFields(
                        { name: 'Status', value: `${statusUser}`}
                    )
            await interaction.reply({ embeds: [embed_info], ephemeral: false})
        } catch (error) {
            console.log(error)
        }
    }
}