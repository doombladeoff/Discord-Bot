const { EmbedBuilder, AuditLogEvent } = require('discord.js');
const client = require('../../index.js');
const channelId = require('../../../channels.json');

client.on('roleDelete', async (role) => {
    console.log(role)
    try {
        if(channelId.logChannel){
            const AuditLogFetch = await role.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.RoleDelete
            });
            if (!AuditLogFetch.entries.first()) return console.log('No entries found.')
            const Entry = AuditLogFetch.entries.first();
            const embed_role_delete = new EmbedBuilder()
                .setTitle(`Роль удалена - ${role.name}`)
                .setColor("Red")
                .addFields(
                    {name: `Имя: `, value: `\`\`\`${role.name}\`\`\``, inline: true},
                    {name: `ID: `, value: `\`\`\`${role.id}\`\`\``, inline: false},
                    {name: `Color: `, value: `\`\`\`${role.hexColor}\`\`\``, inline: true},
                    {name: `User: `, value: `\`\`\`${Entry.executor.tag}\`\`\``, inline: true},
                )
                .setTimestamp()
        
            client.channels.cache.get(`${channelId.logChannel.id}`).send({ embeds: [embed_role_delete] });    
        } else {
            console.log('Non setup channel log.')
        }
    } catch (error) {
        console.log(error)
    }
})