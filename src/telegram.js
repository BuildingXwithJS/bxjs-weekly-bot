const Telegraf = require('telegraf');
const bus = require('./messagebus');
const {getPosts, clearDb} = require('./storage');

const owner = 'yamalight';
const MAX_MESSAGE_LENGTH = 4096;

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

  // filter out empty and broken posts
  const filteredPosts = posts.filter(p => p && p.length > 0);

  let message = '';
  // contact posts into new messages in chunks
  while (filteredPosts.length > 0) {
    const messageLength = message.length + filteredPosts[0].length;
    if (messageLength > MAX_MESSAGE_LENGTH) {
      ctx.reply(message);
      message = '';
    }
    message += filteredPosts.shift() + '\n';
  }
  // send rest of message if needed
  if (message.length > 0) {
    ctx.reply(message);
  }
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
