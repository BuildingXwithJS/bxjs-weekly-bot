const startTelegram = require('./telegram');
const startDiscord = require('./discord');

module.exports = () => {
  startTelegram();
  startDiscord();
};
