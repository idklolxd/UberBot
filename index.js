const discord = require('discord.js');

const TOKEN = "MzU0MzU4MDA3Mzc2NjQyMDQ4.DI9FSg.7S8rB-lJ0WUBGcR6Rwga8LHO8gw"
const PREFIX = "$"

var ball = ['Yes',
'No doubt about it',
'Try again','signs point to yes',
'I say no',
'No chance',
'Dont think so'];

const bot = new discord.Client();

//ffmpeg –version

bot.on('ready', function() {
    bot.user.setGame(bot.guilds.size + ` servers | ` + `Do $help`)
    console.log('Ready!')
});

bot.on('message', function(message) {
    if (message.author.equals(bot.user)) return;
    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0].toLowerCase()) {
        case "ping":
            message.channel.send('pong!');
            break;
        case "info":
            message.channel.send('I\'m a bot created by Alumark.  ' + PREFIX + 'help for more commands.');
            break;
        case "8ball":
            message.channel.send(ball[Math.floor(Math.random () * ball.length)]);
            break;
        case "help":
        let embed = new discord.RichEmbed()
        .setColor(0x2ECC71)
        .addField('Commands:', `UberBot`)
        .addField('ping:', `sends "pong!" \n Usage: $ping`)
            break;
        default:
            message.channel.send('Invalid Command.')
    }
});

bot.login(TOKEN);