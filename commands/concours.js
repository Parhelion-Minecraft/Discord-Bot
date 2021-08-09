exports.run = (client, interaction) => {
    const { MessageEmbed } = require('discord.js');

    const concoursEmbed = new MessageEmbed()
        .setTitle("Concours en cours")
        .addField("💰 À gagner", "2 000 Rioz")
        .addField("🖊️ Modalités de participation", "Ouvert à tous")
        .addField("📜 Description du concours", "Inviter le plus de monde possible sur notre serveur Discord.")
        .addField("⏱️ Fin du concours", "Le 23/08/2021")

    interaction.reply({
        embeds: [concoursEmbed]
    });
}