const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { PermissionsBitField } = require('discord.js');

const channelIdLog = require('../../../channels.json');
const embed_lock = new EmbedBuilder();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Запретить сообщения в канале для @everyone')
        .setDefaultMemberPermissions(PermissionsBitField.Administrator)
        .addChannelOption(option => {
            return option
                .setName('channel')
                .setDescription('Какой канал')
                .setRequired(false)
        }),

        run: async (client, interaction) =>{
            embed_lock.data = []
            const channel = interaction.options.getChannel('channel');
            //console.log(interaction, channel)

            if(!channel){
                const getThisChannel = interaction.channel;
                await getThisChannel.permissionOverwrites.edit(
                    interaction.guild.id, 
                    { 
                        [PermissionsBitField.Flags.SendMessages]: false,
                        [PermissionsBitField.Flags.SendMessagesInThreads]: false,
                        [PermissionsBitField.Flags.SendVoiceMessages]: false,
                        [PermissionsBitField.Flags.CreatePrivateThreads]: false,
                        [PermissionsBitField.Flags.CreatePublicThreads]: false,
                    })
                await getChannelPerms(interaction, getThisChannel)
                
            } else {
                await channel.permissionOverwrites.edit(
                    interaction.guild.id, 
                    { 
                        [PermissionsBitField.Flags.SendMessages]: false,
                        [PermissionsBitField.Flags.SendMessagesInThreads]: false,
                        [PermissionsBitField.Flags.SendVoiceMessages]: false,
                        [PermissionsBitField.Flags.CreatePrivateThreads]: false,
                        [PermissionsBitField.Flags.CreatePublicThreads]: false,
                    });
                await getChannelPerms(interaction, channel)
            }

            client.channels.cache.get(`${channelIdLog.logChannel.id}`).send({ embeds: [embed_lock] });  
        }
}

async function getChannelPerms (interaction, channelID){
    embed_lock
        .setDescription(`**${interaction.member.nickname} обновляет права канала <#${channelID.id}> для @everyone**`)
        .setColor('Red')
        .setTimestamp()
        .addFields({
            name: 'Текущие права канала',
            value: ' ',
        })
    const channelData = interaction.guild.channels.cache.get(channelID.id);
    const everyoneRole = interaction.guild.id
    const everyoneOverwrite = channelData.permissionOverwrites.cache.get(everyoneRole);
        console.log(`Парава канала ${channelID.name}:`,everyoneOverwrite)
    const deniedPermissions = everyoneOverwrite ? new PermissionsBitField(everyoneOverwrite.deny).toArray() : [];
        console.log(deniedPermissions)

        for(let i = 0; i < deniedPermissions.length; i++){
            embed_lock.addFields(
                {
                    name: `${deniedPermissions[i]}`,
                    value: `\`\`\`❌ False\`\`\``, 
                    inline: true
                })
        }
}