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
  const posts = await getPosts();
  if (!posts.length) {
    ctx.reply('No saved messages yet!');
    return;
  }
  ctx.reply(posts.join('\n'));
});

bot.command('clear', async ctx => {
  const {from} = ctx.update.message;
  if (from.username !== owner) {
    ctx.reply('Sorry! Only Tim is allowed to do that :)');
    return;
  }
  await clearDb();
  ctx.reply('Done. Database cleared.');
});

bot.command('count', async ctx => {
  const posts = await getPosts();
  ctx.reply(`I currently have ${posts.length} posts saved.`);
});

module.exports = () => {
  bot.launch();
  console.log('Telegram bot started');
};
