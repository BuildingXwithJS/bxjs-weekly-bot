const Telegraf = require('telegraf');
const bus = require('./messagebus');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.on('channel_post', ctx => {
  const {text} = ctx.update.channel_post;
  bus.emit('message', text);
});

module.exports = () => {
  bot.launch();
  console.log('Telegram bot started');
};
