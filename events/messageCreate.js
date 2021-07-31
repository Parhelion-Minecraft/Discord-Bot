module.exports = (client, message) => {
    const config = require('../config.json');

    if (message.channel.id === config.introduction_channel) {
        message.react("👋");
    }

    if (message.channel.id === config.poll_channel) {
        const emojis = ["✔️", "❌"];

        emojis.forEach((element, i) => {
            setTimeout(() => {
                message.react(element)
            }, 200 * i);
        });
    }
};