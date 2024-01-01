require('dotenv').config();
const ExtendedClient = require('./class/ExtendedClient');
const GiveawaysManager = require('./giveaways')

const client = new ExtendedClient();

client.start();
client.giveawaysManager = new GiveawaysManager(client, {
  default: {
    botsCanWin: false,
    embedColor: `#0000ff`,
    embedColorEnd: `#0000ff`,
    reaction: `🎉`,
  },
});

// Handles errors and avoids crashes, better to not remove them.
process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);