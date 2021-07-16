exports.run = (client, message, args) => {
    const config = require('../config.json');
    const { MessageEmbed, WebhookClient } = require('discord.js');

    const text = message.content.replace("pm.success ", "");

    if (text === "") {
        const no_arg = new MessageEmbed()
            .setAuthor("Parhelion", message.guild.iconURL())
            .setTitle("Erreur")
            .setColor("#FF2200")
            .setDescription(`Vous devez indiquer le succès à générer.`)

        message.channel.send(no_arg);
    } else {
        if (text.length > 23) {
            const too_long = new MessageEmbed()
                .setAuthor("Parhelion", message.guild.iconURL())
                .setTitle("Erreur")
                .setColor("#FF2200")
                .setDescription(`Votre succès doit contenir au maximum 23 caractères.`)

            message.channel.send(too_long);
        } else {
            message.delete();
            message.channel.send(`https://minecraftskinstealer.com/achievement/1/Succès%20débloqué%20!/${text}`);
        }
    }
}
