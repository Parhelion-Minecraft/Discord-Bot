module.exports = client => {
    const config = require('../config.json');
    const { MessageEmbed, WebhookClient } = require('discord.js');

    console.log('Bot lancé avec succès !');

    const tmi = require('tmi.js');

    const twitchClient = new tmi.Client({
        identity: {
            username: 'parhelionbot',
            password: process.env.OAuth
        },
        channels: ['parhelionminecraft']
    });
    
    twitchClient.connect()
        .then(function () {
            console.log('Bot connecté !');
        })
        .catch(err => {
            console.error(err);
        });

    setInterval(() => {
        if (client.channels.cache.get(config.agenda_channel).topic === "🔴 Nous sommes en live sur https://twitch.tv/ParhelionMinecraft") return;

        twitchClient.api({
            url: "https://api.twitch.tv/kraken/streams/704587851",
            headers: {
                "Client-ID": process.env.clientID,
                "Accept": "application/vnd.twitchtv.v5+json"
            }
        }, (err, res, body) => {
            if (body.stream === null) return;

            client.channels.cache.get(config.agenda_channel).edit({ topic: "🔴 Nous sommes en live sur https://twitch.tv/ParhelionMinecraft" })

            const hook = new WebhookClient(config.stream_webhook["id"], config.stream_webhook["token"]);

            hook.send('@everyone', {
                "embeds": [
                    {
                        "title": "Live",
                        "description": "Bonjour !\nNous sommes en live sur notre chaîne [Twitch](https://twitch.tv/ParhelionMinecraft). Rejoignez-nous !",
                        "color": "#fbab31",
                        "author": {
                            "name": "Parhelion",
                            "icon_url": "https://i.ibb.co/6X7hqWr/50-C249-DF-A19-C-4-F8-A-B7-FD-ECDD84504-A9-D.png"
                        },
                        "thumbnail": {
                            "url": "https://i.ibb.co/6X7hqWr/50-C249-DF-A19-C-4-F8-A-B7-FD-ECDD84504-A9-D.png"
                        }
                    }
                ]
            })
        });
    }, 60000);
}