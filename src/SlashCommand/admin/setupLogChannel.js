const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionsBitField, Channel, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

const client = require('../../index.js')
var channelIdLog = require('../../../channels.json');
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup_log_channel")
        .setDefaultMemberPermissions(PermissionsBitField.Administrator)
        .setDescription("Установить канал для логов."),
    run: async (client, interaction) => {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
            return interaction.reply({ content: "У вас нет прав для этой команды." })
        
        try {
            if(channelIdLog.logChannel){
                let channelInfo = channelIdLog
                const button_create = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('create_channel_log')
                            .setLabel('Создать')
                            .setStyle(ButtonStyle.Secondary)
                    );

                const embed_message = new EmbedBuilder()
                    .setColor('Purple')
                    .setTitle('LOGs Channel')
                    .setDescription(`Канал <#${channelInfo.logChannel.id}> для логов уже настроент. Хотите установить этот канал по умолчанию?.`);
                await interaction.reply({ embeds: [embed_message], components: [button_create] })
            }

            if(!channelIdLog.logChannel){
                createChannelLog(interaction)
            }

        } catch (error) {
            console.log(error)
        }
    }
}

client.on("interactionCreate", async (interaction) => {
    try {
        if(interaction.isButton()){
            if(interaction.customId == 'create_channel_log'){
                createChannelLog(interaction)
            }
        }
    } catch (error) {
        console.log(error)
    }
})

function createChannelLog(interaction){
    let getIdChannel = interaction.channelId
    let channelData = {
        logChannel:{
            name: `${interaction.channel.name}`,
            id: getIdChannel
        }
    }
    fs.writeFileSync('channels.json', JSON.stringify(channelData, null, 4), (err) => err && console.error(err));
    return interaction.reply({ content: `Канал <#${interaction.channelId}> установлен по умолчанию.`})
}