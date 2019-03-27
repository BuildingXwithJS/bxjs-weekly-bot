const startTelegram = require('./telegram');
const startDiscord = require('./discord');
const startDb = require('./storage');

module.exports = async () => {
  await startDb();
  await startDiscord();
  startTelegram();
};
