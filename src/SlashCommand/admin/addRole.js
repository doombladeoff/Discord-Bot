const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionsBitField, Channel, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, CommandInteraction } = require('discord.js');
const channelIdLog = require('../../../channels.json');
const user = {
    member: '',
    target: ''
}
module.exports = {
    data: new SlashCommandBuilder()
        .setName("role")
        .setDefaultMemberPermissions(PermissionsBitField.Administrator)
        .setDescription("Добавить роль пользователю.")
// Add Role
        .addSubcommand(subcommand =>
            subcommand
            .setName('add_role')
            .setDescription('Добавить роль.')
            .addUserOption(option =>
                option
                    .setName('target')
                    .setDescription('Пользователь.')
                    .setRequired(true)
            )
            .addRoleOption(option =>
                option
                    .setName('newrole')
                    .setDescription('Какая роль.')
                    .setRequired(true)))
// Remove role
	    .addSubcommand(subcommand =>
		    subcommand
			.setName('remove_role')
			.setDescription('Убрать роль.')
            .addUserOption(option =>
                option
                    .setName('target')
                    .setDescription('Пользователь.')
                    .setRequired(true)
            )
            .addRoleOption(option =>
                option
                    .setName('newrole')
                    .setDescription('Какая роль.')
                    .setRequired(true))),

    run: async (client, interaction) => {

        const role = interaction.options.getRole('newrole')
        console.log(role)

        const embed_info = new EmbedBuilder()
            .addFields(
                { name: 'Role name:', value: role.name, inline: false},
                { name: 'Role tag:', value: `<@&${role.id}>`, inline: false},
                { name: '\n', value: `\n`, inline: true},
            )

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
            return interaction.reply({ content: "У вас нет прав для этой команды." })

        if (interaction.options.getSubcommand() === 'add_role'){
            try {
                //GET USER
               await getUser(interaction, client)
               
               if(user.target.bot){
                    console.error('Я не могу добавлять себе роль.')
                    return interaction.reply({content: `❌ Я не могу добавлять себе роль!`,ephemeral: true})
                }
                
                if(!role.editable) return interaction.reply({ content: "❌ Я не могу добавлять роли выше моей.", ephemeral: true})

                if(user.member.roles.add(role)){
                    embed_info
                        .setColor('Aqua')
                        .setAuthor({ name: `Добавялет ${user.target.username} роль`, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
                        .setThumbnail(`${user.member.displayAvatarURL({ dynamic: true })}`)
                        .addFields(
                            { 
                                name: 'Ответственный модератор:', 
                                value: `<@${interaction.member.id}>`, 
                                inline: false 
                            }
                        )
                        .setTimestamp()
                    await interaction.reply({ embeds: [embed_info], ephemeral: true})
        
                    if(channelIdLog.logChannel.id){
                        client.channels.cache.get(`${channelIdLog.logChannel.id}`).send({ embeds: [embed_info] });  
                    }
                }
            } catch (error) {
                console.error(error)
            }
        }

        if (interaction.options.getSubcommand() === 'remove_role'){
            try {
                //GET USER
                await getUser(interaction, client)

                if(user.target.bot){
                    console.error('Я не могу удалять себе роль.')
                    return interaction.reply({content: `❌ Я не могу удалять себе роль!`,ephemeral: true})
                }

                if(!role.editable) return interaction.reply({ content: "❌ У меня недотсаточно прав.", ephemeral: true})

                if(user.member.roles.remove(role)){
                    embed_info
                        .setColor('Aqua')
                        .setAuthor({ name: `Убирает у ${user.target.username} роль`, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
                        .setThumbnail(`${user.member.displayAvatarURL({ dynamic: true })}`)
                        .addFields(
                            { 
                                name: 'Ответственный модератор:', 
                                value: `<@${interaction.member.id}>`, 
                                inline: false
                            },
                        )
                        .setTimestamp();
                    await interaction.reply({ embeds: [embed_info], ephemeral: true})
    
                    if(channelIdLog.logChannel.id){
                        client.channels.cache.get(`${channelIdLog.logChannel.id}`).send({ embeds: [embed_info] });  
                    }
                }
            } catch (error) {
                console.error(error)
            }
        }
    }
}

async function getUser(interaction, client){
    //GET USER
    user.target = interaction.options.getUser('target')
    const guild = client.guilds.cache.get(`${interaction.guild.id}`);
    user.member = await guild.members.fetch(user.target.id)

    return (user.member, user.target)
}