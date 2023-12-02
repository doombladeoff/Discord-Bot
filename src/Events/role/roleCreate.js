const { EmbedBuilder, AuditLogEvent } = require('discord.js');
const client = require('../../index.js');
const channelId = require('../../../channels.json');

client.on('roleCreate', async (role) => {
    try {
        if(channelId.logChannel){
            console.log(role); 

            const AuditLogFetch = await role.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.RoleDelete
            });
            const Entry = AuditLogFetch.entries.first();
            const embed_role_create = new EmbedBuilder()
                .setTitle(`Создана роль - ${role.name}`)
                .setColor("Green")
                .addFields(
                    {name: `Name: `, value: `\`\`\`${role.name}\`\`\``, inline: true},
                    {name: `ID: `, value: `\`\`\`${role.id}\`\`\``, inline: false},
                    {name: `Editable: `, value: `\`\`\`${role.editable}\`\`\``, inline: true},
                    {name: `Color: `, value: `\`\`\`${role.hexColor}\`\`\``, inline: true},
                    {name: `Author: `, value: `\`\`\`${Entry.executor.tag}\`\`\``, inline: true},
                )
                .setTimestamp() 

                client.channels.cache.get(`${channelId.logChannel.id}`).send({ embeds: [embed_role_create] });
        } else {
            console.log('Non setup channel log.')
        }
    } catch (error) {
        console.log(error)
    }
})