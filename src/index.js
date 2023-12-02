const { Client, Collection, PermissionsBitField, GatewayIntentBits, EmbedBuilder, Partials} = require('discord.js');

const { TOKEN } = require('../../config.json')
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent,
  ],
  shards: 'auto',
  partials: [
    Partials.Message, 
    Partials.Channel, 
    Partials.GuildMember, 
    Partials.Reaction, 
    Partials.GuildScheduledEvent, 
    Partials.User, 
    Partials.ThreadMember
  ]
});
const fs = require('fs');
module.exports = client;
const discordModals = require('discord-modals');
discordModals(client);



// slashCommand handler
client.slashcommand = new Collection();

[ "ClientEvent", "SlashCommands", "HandlingError" ].forEach((Handler) => {
  try {
      require(`../src/Handler/${Handler}`)(client)
      console.log(`[HANDLER] Loaded ${Handler} System`)
  } catch (e) {
      console.log(`Error Found In Handler Called ${Handler}\n${e}`)
  }
})
// client.on("ready", async (member) => {

//   console.log("[ READY ]");
// })

// client.on("interactionCreate", async (interaction) => {
//   if (!interaction.isChatInputCommand()) return;
//   const _slashcommand = client.slashcommand.get(interaction.commandName)
//   if (!_slashcommand) return;

//   try {
//     await _slashcommand.run(client, interaction);
//   } catch (e) {
//     console.error(e);
//   }
// })

client.login(TOKEN);
