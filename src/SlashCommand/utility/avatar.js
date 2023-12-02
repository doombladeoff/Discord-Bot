const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const client = require('../../index')
module.exports = {
	data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Получить аватар")
// User
	    .addSubcommand(subcommand =>
		    subcommand
			.setName('target')
			.setDescription('Укажите пользователя.')
			.addUserOption(option =>
                option
                    .setName('target')
                    .setDescription('The user')
                    .setRequired(true)
            ))
// User Banner
        .addSubcommand(subcommand =>
            subcommand
            .setName('user_banner')
            .setDescription('Банер пользователя.')
            .addUserOption(option =>
                option
                    .setName('target')
                    .setDescription('Пользователь.')
                    .setRequired(true)
            ))
// Server
	    .addSubcommand(subcommand =>
		    subcommand
			.setName('server')
			.setDescription('Аватар сервера.')),
	run: async (client, interaction) => {
        const embed = new EmbedBuilder()

        if (interaction.options.getSubcommand() === 'target'){
            const target = interaction.options.getUser('target')
            const guild = client.guilds.cache.get(`${interaction.guild.id}`)
            const member = await guild.members.fetch(target.id)
            console.log(member)
            if(target){
                embed
                    .setTitle(`${target.username} Avatar`)
                    .setColor('Purple')
                    .setImage(target.displayAvatarURL({
                        dynamic: true,
                        size: 1024
                    }))
                interaction.reply({embeds: [embed]})
            }
        }

        if (interaction.options.getSubcommand() === 'user_banner'){
            const target = interaction.options.getUser('target')
            if(target){
                const user = await client.users.fetch(target.id, { force: true });
                if(user.bannerURL()){
                    embed
                    .setTitle(`${target.username} Banner`)
                    .setColor('Purple')
                    .setImage(user.bannerURL({
                        dynamic: true,
                        size: 4096
                    }))
                    interaction.reply({embeds: [embed]})
                } else {
                    interaction.reply({content: 'К сожалению баннера нет.'})
                }
            }
        }

        if (interaction.options.getSubcommand() === 'server'){
            const guild = client.guilds.cache.get(`${interaction.guild.id}`);
            console.log(guild)
            embed
                .setTitle(`${interaction.guild.name} Guild Avatar`)
                .setColor('Purple')
                .setImage(guild.iconURL({
                    dynamic: true,
                    size: 1024
                }))
            interaction.reply({embeds: [embed]})
        }
    }
}