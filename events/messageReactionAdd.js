module.exports = (client, reaction, user) => {
    const config = require('../config.json');

    if (user.id === client.user.id) return;

    if (reaction.message.channel.id === config.ticket_channel) {
        reaction.users.remove(user.id);

        if (client.guilds.cache.get(config.server_id).channels.cache.filter(channel => channel.name === user.id).first()) {
            return user.send("Vous ne pouvez ouvrir qu'un seul ticket à la fois.");
        }

        client.guilds.cache.get(config.server_id).channels.create(user.id, { parent: config.ticket_category })
            .then(channel => {
                channel.overwritePermissions([{ id: user.id, alow: ["VIEW_CHANNEL", "SEND_MESSAGES"] }])
                    .then(() => {
                        channel.send(`Ticket créé par <@${user.id}>`);

                        switch (reaction.emoji.name) {
                            case "❓":
                                channel.send("Ce ticket concerne une demande d'aide.");
                                break;

                            case "🔗":
                                channel.send("Ce ticket concerne une demande de partenariat.");
                                break;

                            case "📯":
                                channel.send("Ce ticket concerne une catégorie non listée.");
                                break;
                        }
                    });
            });
    }
}