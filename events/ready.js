module.exports = client => {
    const config = require('../config.json');
    const { WebhookClient } = require('discord.js');
    const fs = require('fs');

    console.log('Bot lancé avec succès !');

    client.guilds.fetch(config.server_id)
        .then(guild => {
            guild.invites.fetch().then(guildInvites => {
                let invites = [];

                guildInvites.forEach(invite => {
                    invites.push({ code: invite.code, inviter: invite.inviter.id, uses: invite.uses })
                });

                fs.writeFileSync("invites/cache.json", JSON.stringify(invites));
            });
        });
}