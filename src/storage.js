const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const bus = require('./messagebus');

const adapter = new FileSync(path.join(__dirname, '..', 'db', 'db.json'));
const db = low(adapter);

bus.on('message', (text) => {
  db.get('posts').push(text).write();
});

exports.getPosts = () => {
  return db.get('posts').value();
};

exports.clearDb = () => {
  return db.get('posts').remove().write();
};

exports.startDb = async () => {
  // Set some defaults (required if your JSON file is empty)
  await db.defaults({ posts: [] }).write();
};
