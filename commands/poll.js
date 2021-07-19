exports.run = (client, message, args) => {
    const config = require('../config.json');
    const { MessageEmbed, WebhookClient } = require('discord.js');

    if (!message.member.roles.cache.has(config.admin_role)) {
        const no_perm = new MessageEmbed()
            .setAuthor("Parhelion", message.guild.iconURL())
            .setTitle("Erreur")
            .setColor("#FF2200")
            .setDescription(`Vous devez être administrateur pour pouvoir effectuer cette commande !`)

        message.channel.send(no_perm);
    } else {
        const hook = new WebhookClient(config.poll_webhook["id"], config.poll_webhook["token"]);

        hook.send({
            "embeds": [
                {
                    "description": message.content.replace('pm.poll', ""),
                    "color": "#fbab31"
                }
            ]
        })
            .then(() => {
                message.delete();
                
                message.channel.send("Sondage publié avec succès !");
            })
            .catch(err => {
                message.channel.send("Une erreur est survenue. Merci de consulter la console.");
                console.error(err);
            })
    }
}