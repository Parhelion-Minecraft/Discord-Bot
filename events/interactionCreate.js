module.exports = (client, interaction) => {
    const { MessageEmbed } = require('discord.js');

    if (interaction.isButton()) {
        const customID = interaction.customId;

        const component = client.components.get(customID);

        if (!component) {
            const noexist_cmd = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setColor('#FF2200')
                .setTitle('Commande inexistante')
                .setDescription('Vous avez tenté d\'exécuter une commande inexistante.')
                .setTimestamp()

            return interaction.reply({ embeds: [noexist_cmd], ephemeral: true });
        }

        component.run(client, interaction);
    }
}