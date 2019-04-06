const Discord = require('discord.js');
const bus = require('./messagebus');

const client = new Discord.Client();

const bxjsWeeklyChannelId = '560410743032250384';

bus.on('message', text => {
  client.channels.get(bxjsWeeklyChannelId).send(text);
});

// catch errors so that discord client doesn't crash
// see: https://github.com/BuildingXwithJS/bxjs-weekly-bot/issues/1
client.on('error', () => {});

module.exports = () =>
  new Promise(resolve => {
    client.on('ready', () => {
      console.log(`Logged in as ${client.user.tag}!`);
      resolve();
    });
    client.login(process.env.DISCORD_BOT_TOKEN);
  });
