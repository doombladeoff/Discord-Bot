const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { PermissionsBitField } = require('discord.js');

const channelIdLog = require('../../../channels.json');
const embed_unlock = new EmbedBuilder();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Разрешить сообщения в канале для @everyone')
        .setDefaultMemberPermissions(PermissionsBitField.Administrator)
        .addChannelOption(option => {
            return option
                .setName('channel')
                .setDescription('Какой канал')
                .setRequired(false)
        }),

        run: async (client, interaction) =>{
            embed_unlock.data = []
            const channel = interaction.options.getChannel('channel');
            console.log(interaction, channel)

            if(!channel){
                const getThisChannel = interaction.channel;

                await getThisChannel.permissionOverwrites.edit(
                    interaction.guild.id, 
                    {
                        [PermissionsBitField.Flags.SendMessages]: null,
                        [PermissionsBitField.Flags.SendMessagesInThreads]: null,
                        [PermissionsBitField.Flags.SendVoiceMessages]: null,
                        [PermissionsBitField.Flags.CreatePrivateThreads]: null,
                        [PermissionsBitField.Flags.CreatePublicThreads]: null,  
                    });
                await getChannelPerms(interaction, getThisChannel);

            } else {
               await channel.permissionOverwrites.edit(
                    interaction.guild.id, 
                    {
                        [PermissionsBitField.Flags.SendMessages]: null,
                        [PermissionsBitField.Flags.SendMessagesInThreads]: null,
                        [PermissionsBitField.Flags.SendVoiceMessages]: null,
                        [PermissionsBitField.Flags.CreatePrivateThreads]: null,
                        [PermissionsBitField.Flags.CreatePublicThreads]: null,
                    });
                await getChannelPerms(interaction, channel)
                }
                
            client.channels.cache.get(`${channelIdLog.logChannel.id}`).send({ embeds: [embed_unlock] });  
            }
}

async function getChannelPerms (interaction, channelID){
    embed_unlock
        .setDescription(`**${interaction.member.nickname} сбрасывает блокировку канала <#${channelID.id}> для @everyone**`)
        .setColor('Green')
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
            embed_unlock.addFields(
                {
                    name: `${deniedPermissions[i]}`,
                    value: `\`\`\`❌ False\`\`\``, 
                    inline: true
                })
        }
}