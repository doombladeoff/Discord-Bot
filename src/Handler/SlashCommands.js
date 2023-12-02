const fs = require("fs");
const { PermissionsBitField, Routes } = require("discord.js");
const { REST } = require("@discordjs/rest");
const config = require('../../config.json')

module.exports = async (client) => {
    const data = [];
    fs.readdirSync('./src/SlashCommand').forEach((dir) => {
        if(dir.endsWith(".js")) return console.error(`[ ${dir} ] не является папкой`)
    console.log(`[ FOLDER ]`, dir)
        const slashCommandFile = fs.readdirSync(`./src/SlashCommand/${dir}/`).filter((files) => files.endsWith(".js"));
        for (const file of slashCommandFile) {
            const slashCommand = require(`../SlashCommand/${dir}/${file}`)

            client.slashcommand.set(slashCommand.data.name, slashCommand);
            console.log(`\t✅ [ Slash CMD ] Client SlashCommands Command (/) Loaded: ${file}`);
            //console.log(`\t[ Slash CMD ] Client SlashCommands Command (/) Loaded: ${slashCommand.data.name}`);

            data.push(slashCommand.data.toJSON())
        }
    });
    const rest = new REST({ version: "10" }).setToken(config.TOKEN);
    client.on("ready", async () => {
        (async () => {
            try {
                console.log(`[ Slash CMD ] Started refreshing application (/) commands.`);
                await rest.put(Routes.applicationCommands(config.clientID), {
                   body: data,
                });
                console.log(`[ Slash CMD ] Successfully reloaded application (/) commands.`);
            } catch (error) {
                console.error(`[ Slash CMD ] SlashError: ${error}`);
            }
        })();
    })
};