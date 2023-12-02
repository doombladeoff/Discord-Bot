const { SlashCommandBuilder } = require("@discordjs/builders")
const { PermissionsBitField, Channel } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Удалить сообщения")
        .addIntegerOption((option) => {
            return option
                .setName('amount')
                .setDescription('Количество удаленных сообщений')
                .setRequired(true)
        })
        .addUserOption((option) => {
            return option
            .setName('target')
            .setDescription('Указать пользователя')
            .setRequired(false)
        }),
	run: async (client, interaction) => {
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ content: "У вас нет прав для этой команды."})
        if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ content: "У меня нет прав для этой команды."})

        const amount = interaction.options.getInteger('amount')
        const target = interaction.options.getMember('target')
        const Channel = interaction.channel;
        const Messages = Channel.messages.fetch();


        if(target) {
            const TargetMessage = (await Messages).filter((m) => m.author.id === target.id)
            await Channel.bulkDelete(TargetMessage, true)
            interaction.reply({content: `Удалены сообщения отправленые - ${target}`, ephemeral: false})
        } else {
            if(isNaN(amount) || amount < 1) {
                return interaction.reply({content: 'Укажите от 1 до 100', ephemeral: true})
            }
            
            if(parseInt(amount) > 99) {
                return interaction.reply({content: 'Я могу удалить за раз 99 сообщений', ephemeral: true})
            } else {
                Channel.bulkDelete(amount, true);
                interaction.reply({content: `Удалено ${amount} сообщений в ${Channel}`, ephemeral: true})
            }
        }
    }
}