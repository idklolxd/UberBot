const discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    client.user.setGame(client.guilds.size + ` servers | ` + `Do $commands`)
  });


client.login('MzU0MzU4MDA3Mzc2NjQyMDQ4.DI9FSg.7S8rB-lJ0WUBGcR6Rwga8LHO8gw');