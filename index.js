const discord = require('discord.js');
const client = new discord.Client();
const prefix = "$";

client.on('ready', () => {
    client.user.setGame(client.guilds.size + ` servers | ` + `Do $help`)
});

client.on('message', message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
  
    let command = message.content.split(" ")[0]
    command = command.slice(prefix.length)
    console.log(command);
  
    let args = message.content.split(" ").slice(1);

    if (message.content === "ping") {
        message.channel.send("pong");
    } 
    if (message.content === "pong") {
        message.channel.send("ping");
    }

});

client.login('MzU0MzU4MDA3Mzc2NjQyMDQ4.DI9FSg.7S8rB-lJ0WUBGcR6Rwga8LHO8gw');