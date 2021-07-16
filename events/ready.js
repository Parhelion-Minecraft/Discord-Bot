module.exports = client => {
    const config = require('../config.json');
    const { MessageEmbed } = require('discord.js');

    console.log('Bot lancé avec succès !');

    const ticket_embed = new MessageEmbed()
        .setAuthor("Parhelion", client.guilds.cache.get(config.server_id).iconURL())
        .setColor('#159997')
        .setTitle('Contacter notre équipe')
        .setDescription("Vous souhaitez contacter notre équipe ? Vous êtes au bon endroit ! \nTout d'abord, sur quoi porte votre demande ?")
        .addField("Demander de l'aide", "Réagissez avec l'emoji ❓")
        .addField("Proposer un partenariat", "Réagissez avec l'emoji 🔗")
        .addField("Autre", "Réagissez avec l'emoji 📯")
        .setTimestamp()

    client.channels.cache.get(config.ticket_channel).send(ticket_embed)
        .then(message => {
            const emojis = ["❓", "🔗", "📯"];

            emojis.forEach((element, i) => {
                setTimeout(() => {
                    message.react(element)
                }, 200 * i);
            });
        });
}