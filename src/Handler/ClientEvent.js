const fs = require("fs");

module.exports = (client) => {
    const eventFolder = fs.readdirSync('./src/Events');
    console.log(`[EVENT] Loader`);
    eventFolder.forEach((dir) => {
        const eventFiles = fs.readdirSync(`./src/Events/${dir}/`).filter((files) => files.endsWith(".js"));

        for (const file of eventFiles) {
            const Event = require(`../Events/${dir}/${file}`)
            console.log(`\t✅ [ Events] Client events Loaded: ${file}`);
        }

    });
    
    console.log(`  -  ALL EVENTS LOAD | ✅`)
}