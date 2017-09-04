const discord = require('discord.js');
const ud = require('urban-dictionary');

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
                .addField('UberBot Commands')
                .addField('ping', `Description: sends "pong!" \nUsage: ` + PREFIX + `ping`)
                .addField('info', `Description: tells you about the bot \nUsage: ` + PREFIX + `info`)
                .addField('8ball', `Description: Answers a question you ask like a Magic Eight Ball. (always true!) \nUsage: ` + PREFIX + `8ball`)
            message.channel.send(embed).catch(console.error);
            break;
        case "urban":
            let definition = args.join(' ');
            message.channel.sendMessage("Looking... :mag:");
            
            ud.term(definition, function (error, entries, tags, sounds) {
                if (error) {
                  console.error(error.message)
                  message.channel.sendMessage(error.message);
                } else {
                    let embed = new discord.RichEmbed()
                    .setColor(0x2ECC71)
                    .addField("**" + entries[0].word + "**")
                    .addField('Definition', entries[0].definition)
                    .addField('Example', entries[0].example)
                }
              })
            break;
        default:
            message.channel.send('Invalid Command.')
    }
});

bot.login(TOKEN);