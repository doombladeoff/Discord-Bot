const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionsBitField, Channel, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const fs = require('fs')
const { SpotifyID } = require('../../../config.json')

const Spotify = require('node-spotify-api');
const spotify = new Spotify({
    id: SpotifyID.client_id,
    secret: SpotifyID.clieny_secretId
})
spotify.setToken(SpotifyID.spotify_token)

const SpotifyWebApi = require ( 'spotify-web-api-node' )
const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(SpotifyID.spotify_token)

module.exports = {
    data: new SlashCommandBuilder()
        .setName("spotify")
        .setDescription("---.")
// Track
	    .addSubcommand(subcommand =>
		    subcommand
			.setName('track')
			.setDescription('Найти трек.')
            .addStringOption(option =>
                option
                .setName('find')
                .setDescription('Искать')
                .setRequired(true)
            ))
// User
	    .addSubcommand(subcommand =>
		    subcommand
			.setName('user')
			.setDescription('Укажите пользователя.')
            .addStringOption(option =>
                option
                .setName('find')
                .setDescription('Искать')
                .setRequired(true)
            )),
    run: async (client, interaction) => {
        const query = interaction.options.getString('find')

        const spotifyEmbed = new EmbedBuilder()

        if (interaction.options.getSubcommand() === 'track'){
            spotify.search({ type: 'track', query: query, limit: 1 }, function(err, data) {
                if (err) {
                  return console.log('Error occurred: ' + err);
                }
               
              console.log(data); 
              });

            spotifyApi.searchTracks(query, { limit: 1})
            .then(function(data) {
                try {
                    const track = data.body.tracks.items[0];
                    console.log(`Search ${query}`, track);
    
                    const time = () => {
                        const minute_duration = Math.floor(track.duration_ms / 60000)
                        const seconds_duration = ((track.duration_ms % 60000) / 1000).toFixed(0)
                        return minute_duration + ':' + (seconds_duration < 10 ? '0' : '') + seconds_duration
                    }
                
                    spotifyEmbed
                        //.setThumbnail(`${track.album.images[0].url}`)
                        .setTitle(track.artists[0].name + " " + track.name)
                        .setImage(`${track.album.images[0].url}`)
                        .setColor('#1DB954')
                        .addFields(
                            {
                                name: 'Author', 
                                value: track.artists[0].name,
                                inline: true
                            },
                            {
                                name: 'Release date', 
                                value: track.album.release_date,
                                inline: true
                            },
                            {
                                name: 'Duration',
                                value: time(),
                                inline: true
                            },
                            {
                                name: 'Type',
                                value: track.type, 
                                inline: true
                            }
                        );
    
                    const button_link= new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel('Открыть в Sporify')
                                .setStyle(ButtonStyle.Link)
                                .setURL(`${track.external_urls.spotify}`)
                        );
                    interaction.reply({embeds: [spotifyEmbed],  components: [button_link] })
                } catch (error) {
                    console.error(error)
                }
            },
            function(err){
                console.log(err)
                if((err.body.error.status == 401) && (err.body.error.message == 'The access token expired')){
                    refreshAccessTokenSpotify();
                }
            });
        }

        if (interaction.options.getSubcommand() === 'user'){
            spotifyApi.getUser(query)
            .then(function(data) {
                //console.log('Some information about this user', data.body);
                try {
                    const user = data.body
                    console.log(`Search ${query} user`, user);
                
                    spotifyEmbed
                        //.setThumbnail(`${user.images[0] ? `${user.images[0].url}` : 'https://cdn-icons-png.flaticon.com/512/174/174872.png'}`)
                        .setImage(`${user.images[1] ? `${user.images[1].url}` : 'https://cdn-icons-png.flaticon.com/512/174/174872.png'}`)
                        .setTitle(user.display_name)
                        .setColor('#1DB954')
                        .addFields(
                            {
                                name: 'Followers', 
                                value: `${user.followers.total}`,
                                inline: true
                            },
                            {
                                name: 'id',
                                value: `${user.id}`,
                                inline: true
                            },
                            {
                                name: 'Type',
                                value: `${user.type}`, 
                                inline: true
                            }
                        );
    
                    const button_link= new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel('Открыть в Sporify')
                                .setStyle(ButtonStyle.Link)
                                .setURL(`${user.external_urls.spotify}`)
                        );
                    interaction.reply({embeds: [spotifyEmbed],  components: [button_link] })
                } catch (error) {
                    console.error(error)
                }
            },
            function(err) {
                console.error(err)
                if(err.body.error.message == 'Invalid username')
                    return interaction.reply({content: "❌ Неверное имя пользователя", ephemeral: true})

                if((err.body.error.status == 401) && (err.body.error.message == 'The access token expired')){
                    refreshAccessTokenSpotify();
                }
            });
        }
    }
}

function refreshAccessTokenSpotify(){
    spotifyApi.refreshAccessToken()
    .then(
        function(data) {
            console.log('The access token has been refreshed!');

            // Save the access token so that it's used in future calls
            //spotifyApi.setAccessToken(data.body['access_token']);

            const contentConfig = JSON.parse(fs.readFileSync('config.json', 'utf8'));
            console.log(contentConfig)
            
            contentConfig.SpotifyID.spotify_token = data.body['access_token']
            fs.writeFileSync('config.json', JSON.stringify(contentConfig, null, 4));

            // spotify.search({ type: 'track', query: query, limit: 1}, function(err, data) {
            //     console.log(spotify)
            //     contentConfig.SpotifyID.spotify_token = data.body['access_token']
            //     fs.writeFileSync('config.json', JSON.stringify(contentConfig, null, 4));
            // });

            console.log('The access token is ' + data.body['access_token']);
            console.log('The token expires in ' + data.body['expires_in']);
        },
        function(err) {
            console.log('Could not refresh access token', err);
        }
    );
}