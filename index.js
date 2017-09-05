const discord = require('discord.js');
const ud = require('urban-dictionary');
const YTDL = require('ytdl-core');

const TOKEN = "MzU0MzU4MDA3Mzc2NjQyMDQ4.DI9FSg.7S8rB-lJ0WUBGcR6Rwga8LHO8gw"
const PREFIX = "$"

var ball = ['Yes',
'No doubt about it',
'Try again','signs point to yes',
'I say no',
'No chance',
'Dont think so'];

const bot = new discord.Client();

function play(connection, message) {
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: 'audionly'}));

    server.queue.shift();

    server.dispatcher.on('end', function() {
        if (server.queue[0]) play(connection, message);
        else connection.disconnect();
    });
}

function generateHex() {
    return '#'+Math.floor(Math.random()*16777215).toString(16);
}

var servers = {};

//ffmpeg –version

bot.on('ready', function() {
    bot.user.setGame(bot.guilds.size + ` servers | ` + `Do $help`)
    console.log('Ready!')
});

bot.on('guildMemberAdd', function(member) {
    member.guild.channels.find("name", "general").sendMessage(":inbox_tray: " + member.toString() + " has joined!")

    member.addRole(member.guild.roles.find("find", "Member"));

    member.guild.createRole({
        name: member.user.username,
        color: generateHex(),
        permissions: []

    }).then(function(role) {
        member.user.addRole(role);
    });
});

bot.on('guildMemberRemove', function(member) {
    member.guild.channels.find("name", "general").sendMessage(":outbox_tray: " + member.toString() + " has left.")
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
                .setThumbnail(bot.avatarURL)
                .setTitle('UberBot Commands')
                .addField('ping', `Description: sends "pong!" \nUsage: ` + PREFIX + `ping`)
                .addField('info', `Description: tells you about the bot \nUsage: ` + PREFIX + `info`)
                .addField('8ball', `Description: Answers a question you ask like a Magic Eight Ball. (always true!) \nUsage: ` + PREFIX + `8ball`)
            message.channel.send(embed).catch(console.error);
            break;
        case "urban":
            let definition = args.slice(1).join(" ");

            message.channel.sendMessage("Looking... :mag:");
            
            ud.term(definition, function (error, entries, tags, sounds) {
                if (error) {
                  console.error(error.message)
                  message.channel.sendMessage(error.message);
                } else {
                    let embed = new discord.RichEmbed()
                    .setColor(0x2ECC71)
                    .addField("Urban Dictionary", "**" + entries[0].word + "**")
                    .addField('Definition', entries[0].definition)
                    .addField('Example', entries[0].example)
                    message.channel.send(embed).catch(console.error);
                }
              })
            break;
        case "play":
            if (!args[1]) {
                message.channel.send('Please provide a link');
                return;
            }

            if (!message.member.voiceChannel) {
                message.channel.send('You must be in a voice channel, dumbass.');
                return;
            }
            
            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            };
            var server = servers[message.guild.id];

            if (!message.guild.voiceChannel) message.member.voiceChannel.join().then(function(connection) {
                play(connection, mesage);
            });

            break;
        default:
            message.channel.send('Invalid Command.')
    }
});

bot.login(TOKEN);