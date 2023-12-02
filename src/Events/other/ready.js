const { ActivityType } = require('discord.js');
const config = require("../../../config.json");
const client = require('../../index');

client.on("ready", async => {
  client.user.setPresence({
    status: 'dnd'
  });
  console.log(`[ READY ] \n\tВаш токен: ` + config.TOKEN + `\n\t✅ Успешный вход в систему как: ${client.user.username}`);
});
