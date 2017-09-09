const discord = require('discord.js');
const ud = require('urban-dictionary');
const YTDL = require('ytdl-core');

var tokenreal = "TXpVME16VTRNREEzTXpjMk5qUXlNRFE0LkRKREk2QS5aMTRVWklsMlBORVpPb0dHRlN0enlmZ29KOXM="
const PREFIX = "u/"

var ball = ['Yes',
'No doubt about it',
'Try again','signs point to yes',
'I say no',
'No chance',
'Dont think so'];

var fortunes = [
'You will get laid tonight.',
'Something fishing is going on...',
'You will find out you are gay.',
'You will fall off a cliff.',
'When you have sex your condom will burst.',
'You will have tons of luck.',
'You will learn how to play guitar and get bitches.',
'Your friend will end try to kill himself.',
'Hitler will come back from the dead and you must face him.',
'You\'re gonna die from old age.'
];

const TOKEN = new Buffer(tokenreal, 'base64').toString('ascii');

const bot = new discord.Client();

function play(connection, message) {
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: 'audioonly'}));

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

bot.on("guildCreate", guild => {
    bot.user.setGame(bot.guilds.size + ` servers | ` + `Do $help`)
    console.log(`New guild added : ${guild.name}, owned by ${guild.owner.user.username}`)
});


bot.on('guildMemberAdd', function(member) {
    member.guild.channels.find("name", "general").send(":inbox_tray: " + member.toString() + " has joined!")

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
    member.guild.channels.find("name", "general").send(":outbox_tray: " + member.toString() + " has left.")
});

bot.on('message', function(message) {
    if (message.author.equals(bot.user)) return;
    if (!message.content.startsWith(PREFIX.toLowerCase())) return;

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
                .addField('play', `Description: plays a song, any song. \nUsage: ` + PREFIX + `play youtube-link`)
                .addField('skip', `Description: skips the current song. \nUsage: ` + PREFIX + `skip`)
                .addField('stop', `Description: stops the whole queue. \nUsage: ` + PREFIX + `stop`)
                .addField('urban', `Description: finds a word on urban dictionary \nUsage: ` + PREFIX + `urban word`)
                .addField('fotunecookie', `Description: Opens up a fotune cookie, without the cookie.  You'll get a fortune. \nUsage: ` + PREFIX + `fotunecookie`)
                .addField('fotunecookie', `Description: Stabs a user.  It's gonna hurt, but who cares? \nUsage: ` + PREFIX + `stab @user`)
            message.channel.send(embed).catch(console.error);
            break;
        case "urban":
            let definition = args.slice(1).join(" ");

            message.channel.send("Looking... :mag:");
            
            ud.term(definition, function (error, entries, tags, sounds) {
                if (error) {
                  console.error(error.message)
                  message.channel.send(error.message);
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
                play(connection, message);
            });

            server.queue.push(args[1]);

            break;
        case "skip":
            var server = servers[message.guild.id];

            if (server.dispatcher) server.dispatcher.end();

            break;
        case "stop":
            var server = servers[message.guild.id];

            if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();

            break;
        case "stab":
            let user = message.mentions.users.first();
            if (!user === undefined) return;
            var randomNum = Math.floor(Math.random() * (25 - 1)) + 1;
            if (message.mentions.users.first().id !== "354358007376642048") {
            message.channel.send(`Took ` + randomNum + ` damage from ` + user +  `!`)
            } else {
                message.channel.send(`Ouch.`)
            }
            break;
        case "fortunecookie":
            message.channel.send(fortunes[Math.floor(Math.random () * fortunes.length)]);
            break;
        default:
            message.channel.send('Invalid Command.')
    }
});

bot.login(TOKEN);