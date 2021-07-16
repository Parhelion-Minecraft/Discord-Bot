exports.run = (client, message, args) => {
    const config = require('../config.json');

    if (message.channel.parentID === config.ticket_category) {
        message.channel.delete();

        client.users.cache.get(message.channel.name).send("Votre ticket de support a été fermé.");
    }
}