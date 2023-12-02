const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionsBitField, Channel, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("infobot")
        .setDefaultMemberPermissions(PermissionsBitField.Administrator)
        .setDescription("Информация о боте."),
    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
            return interaction.reply({ content: "У вас нет прав для этой команды." })
        try {
            const embed_info = new EmbedBuilder()
                .setColor('Purple')
                .setTitle('INFO');
            var serversArr = [];
            client.guilds.cache.forEach(guild => {
                serversArr.push(`📡 ` + guild.name);
            })
            embed_info
                .addFields(
                    { name: 'Servers:', value: serversArr.join(`\n`), inline: true},
                    { name: 'Ping:', value: `API Ping is ${Math.round(client.ws.ping)}ms`, inline: true},
                    )
            await interaction.reply({ embeds: [embed_info], ephemeral: true})
        } catch (error) {
            console.log(error)
        }
    }
}