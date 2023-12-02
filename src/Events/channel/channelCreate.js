const { EmbedBuilder, AuditLogEvent } = require('discord.js');
const client = require('../../index');
const channelId = require('../../../channels.json');

client.on('channelCreate', async (channel) => {
    try {
        if(channelId.logChannel){
            const AuditLogFetch = await channel.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.ChannelCreate
            });
            if (!AuditLogFetch.entries.first()) return console.log('No entries found.')
            const Entry = AuditLogFetch.entries.first();
            const embed_channel_create = new EmbedBuilder()
                .setTitle(`Создан канал - ${channel.name}`)
                .setColor("Green")
                .addFields(
                    {name: `Name: `, value: `\`\`\`${channel.name}\`\`\``, inline: true},
                    {name: `Category: `, value: `\`\`\`${channel.parent.name}\`\`\``, inline: true},
                    {name: `ID: `, value: `\`\`\`${channel.id}\`\`\``, inline: false},
                    {name: `Editable: `, value: `\`\`\`${channel.manageable}\`\`\``, inline: true},
                    {name: `Author: `, value: `\`\`\`${Entry.executor.tag}\`\`\``, inline: true},
                )
                .setTimestamp()
        
            client.channels.cache.get(`${channelId.logChannel.id}`).send({ embeds: [embed_channel_create] });  
        }else{
            console.log('Non setup channel log.')
        }  
    } catch (error) {
        console.log(error)
    }
})