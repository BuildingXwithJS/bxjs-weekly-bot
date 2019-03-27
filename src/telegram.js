const Telegraf = require('telegraf');
const bus = require('./messagebus');
const {getPosts, clearDb} = require('./storage');

const owner = 'yamalight';

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.on('channel_post', ctx => {
  const {text} = ctx.update.channel_post;
  bus.emit('message', text);
});

bot.command('dump', async ctx => {
  const {from} = ctx.update.message;
  const posts = await getPosts();
  if (!posts.length) {
    ctx.reply('No saved messages yet!');
    return;
  }
  ctx.reply(posts.join('\n'));
  if (from.username === owner) {
    await clearDb();
  }
});

module.exports = () => {
  bot.launch();
  console.log('Telegram bot started');
};
