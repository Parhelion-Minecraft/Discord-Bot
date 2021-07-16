const { PREFIX } = require("../essentials/config.js");

module.exports = async (bot, data) => {
  bot.user.setActivity(`➜ ${PREFIX}help`);
};
