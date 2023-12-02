const { EmbedBuilder, AuditLogEvent } = require('discord.js');
const client = require('../../index.js');
const channelId = require('../../../channels.json');

client.on('channelDelete', async (channel) => {
    try {
        if(channelId.logChannel){
            const AuditLogFetch = await channel.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.ChannelDelete
            });
            if (!AuditLogFetch.entries.first()) return console.log('No entries found.')
            const Entry = AuditLogFetch.entries.first();
            const embed_channel_delete = new EmbedBuilder()
                .setTitle(`Удален канал`)
                .setColor("Red")
                .addFields(
                    {name: `Name: `, value: `\`\`\`${channel.name}\`\`\``, inline: true},
                    {name: `Category: `, value: `\`\`\`${channel.parent.name}\`\`\``, inline: true},
                    {name: `ID: `, value: `\`\`\`${channel.id}\`\`\``, inline: false},
                    {name: `Editable: `, value: `\`\`\`${channel.manageable}\`\`\``, inline: true},
                    {name: `Author: `, value: `\`\`\`${Entry.executor.tag}\`\`\``, inline: true},
                )
                .setTimestamp()
        
            client.channels.cache.get(`${channelId.logChannel.id}`).send({ embeds: [embed_channel_delete] });    
        }else{
            console.log('Non setup channel log.')
        }
    } catch (error) {
        console.log(error)
    }
})