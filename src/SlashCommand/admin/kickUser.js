const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionsBitField, Channel, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const channelIdLog = require('../../../channels.json')
module.exports = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDefaultMemberPermissions(PermissionsBitField.Administrator)
        .setDescription("Выгнать пользователя")
        .addUserOption((option) => {
            return option
            .setName('target')
            .setDescription('Кого выгнать')
            .setRequired(true)
        })
        .addStringOption((option) =>{
            return option
            .setName('reason')
            .setDescription('Причина')
            .setRequired(false)
        }),
    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
            return interaction.reply({ content: "У вас нет прав для этой команды." })
        try {
            //GET USER INFO
            const target = interaction.options.getUser('target')
            const guild = client.guilds.cache.get(`${interaction.guild.id}`);
            const member = await guild.members.fetch(target.id)
            //console.log(target, member)

            const reason = interaction.options.getString('reason')

            if(target.bot){
                console.error('Я не могу выгнать сам себя.')
                return interaction.reply({content: `❌ Я не могу выгнать себя!`,ephemeral: true})
            }
            if(member.permissions.has(PermissionsBitField.Flags.Administrator)){
                console.error('У пользователя статус Администратора.')
                return interaction.reply({content: `❌ Я не могу выгнать данного пользователя!`,ephemeral: true})
            }

            const embed_info = new EmbedBuilder()
                .setColor('Red')
                //.setTitle(`Выгнали ${target.username}`)
                .setAuthor({ name: `Выгоняет ${target.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
                .setThumbnail(`${member.displayAvatarURL({ dynamic: true })}`)
                .addFields(
                    { name: 'User:', value: target.tag, inline: false},
                    { name: 'ID:', value: `\`\`\`${target.id}\`\`\``, inline: false},
                    { name: 'Причина:', value: `\n${!reason == "" ? reason : '\nNo reason'}`, inline: false},
                    { name: '\n', value: `\n`, inline: true},
                    { name: 'Ответственный модератор:', value: `<@${interaction.member.id}>`, inline: false},
                )
                .setTimestamp();
            await interaction.reply({ embeds: [embed_info], ephemeral: true})

            if(channelIdLog.logChannel.id){
                client.channels.cache.get(`${channelIdLog.logChannel.id}`).send({ embeds: [embed_info] });  
            }

            member.kick({reason: reason})
        } catch (error) {
            console.log(error)
        }
    }
}