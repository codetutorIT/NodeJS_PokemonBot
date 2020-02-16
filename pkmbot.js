const TelegramBot = require('node-telegram-bot-api');
const Discord = require('discord.js');
const Scheduler = require('node-schedule');
const config = require("./config.json");

const discord = new Discord.Client();
const telegram = new TelegramBot(config.telegram_token, {polling: true});



discord.on('message', message => {
    if(message.isMentioned(discord.users.get(config.discord_userid))){
        var discord_message = message.toString();
        var prefix = '<@';
        var prefix_alt = '<@!';
        var suffix = '>';
        var search_string = prefix.concat(config.discord_userid, suffix);
        var msg_filtered = discord_message.replace(search_string, discord.users.get(config.discord_userid).username);
        search_string = prefix_alt.concat(config.discord_userid, suffix);
        var msg = msg_filtered.replace(search_string, discord.users.get(config.discord_userid).username);
        console.log('[PKMBOT] ' + msg);
        telegram.sendMessage(config.telegram_chatid, msg);   
    }
});

discord.on('ready', () => {
    console.log('[PKMBOT] I\'m ready!');
    var rollScheduler = Scheduler.scheduleJob('1 */2 * * *', getPokemon);
})


discord.login(config.discord_token);

function getPokemon(){
    console.log('[PKMBOT] Rolling for Pokemons!');
    var guild = discord.guilds.get(config.discord_guildid);
    if(guild && guild.channels.get(config.discord_channelid)){
        guild.channels.get(config.discord_channelid).send("$pokemon");
        console.log('[PKMBOT] Successfully rolled for Pokemon!');
        telegram.sendMessage(config.telegram_chatid, "[PKMBOT] Successfully rolled for Pokemon!");
    } else {
        console.log("[PKMBOT] ERROR");
        telegram.sendMessage(config.telegram_chatid, "[PKMBOT] ERROR!");
    }
}