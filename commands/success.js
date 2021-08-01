exports.run = (client, interaction) => {
    const { MessageEmbed } = require('discord.js');

    if (interaction.options.get('annonce').value.length > 23) {
        const too_long = new MessageEmbed()
            .setAuthor("Parhelion", interaction.guild.iconURL())
            .setTitle("Erreur")
            .setColor("#FF2200")
            .setDescription(`Votre succès doit contenir au maximum 23 caractères.`)

        interaction.reply({ embeds: [too_long] });
    } else {
        interaction.reply(`https://minecraftskinstealer.com/achievement/1/Succès%20débloqué%20!/${interaction.options.get('annonce').value}`);
    }
}
