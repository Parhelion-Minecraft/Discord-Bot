exports.run = (client, interaction) => {
    const config = require('../config.json');
    const { MessageEmbed, WebhookClient } = require('discord.js');

    if (!interaction.member.roles.cache.has(config.admin_role)) {
        const no_perm = new MessageEmbed()
            .setAuthor("Parhelion", interaction.guild.iconURL())
            .setTitle("Erreur")
            .setColor("#FF2200")
            .setDescription(`Vous devez être administrateur pour pouvoir effectuer cette commande !`)

        interaction.reply({ embeds: [no_perm] });
    } else {
        const hook = new WebhookClient(config.poll_webhook["id"], config.poll_webhook["token"]);

        hook.send({
            "embeds": [
                {
                    "description": interaction.options.get('sondage').value,
                    "color": "#f57e2c"
                }
            ]
        })
            .then(() => {                
                interaction.reply("Sondage publié avec succès !");
            })
            .catch(err => {
                interaction.reply("Une erreur est survenue. Merci de consulter la console.");
                console.error(err);
            })
    }
}