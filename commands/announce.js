exports.run = (client, message, args) => {
    const config = require('../config.json');
    const { MessageEmbed, WebhookClient } = require('discord.js');

    if (!message.member.roles.cache.has(config.admin_role)) {
        const no_perm = new MessageEmbed()
            .setAuthor("Parhelion", message.guild.iconURL())
            .setTitle("Erreur")
            .setColor("#FF2200")
            .setDescription(`Vous devez être administrateur pour pouvoir effectuer cette commande !`)

        message.channel.send({ embeds: [no_perm] });
    } else {
        const hook = new WebhookClient(config.announcements_webhook["id"], config.announcements_webhook["token"]);

        hook.send({
            "embeds": [
                {
                    "description": message.content.replace('pm.announce', ""),
                    "color": "#f57e2c"
                }
            ]
        })
            .then(() => {
                message.delete();
                
                message.channel.send("Annonce publiée avec succès !");
            })
            .catch(err => {
                message.channel.send("Une erreur est survenue. Merci de consulter la console.");
                console.error(err);
            })
    }
}