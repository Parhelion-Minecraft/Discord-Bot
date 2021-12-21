exports.run = (client, interaction) => {
    const { MessageEmbed, MessageButton, MessageSelectMenu } = require('discord.js');

    if (interaction.user.id != interaction.message.channel.name) {
        return interaction.reply({ content: "Vous ne pouvez interagir qu'avec les tickets que vous avez ouverts." });
    }

    const closeButton = new MessageButton()
        .setCustomId('close_ticket')
        .setLabel("Fermer le ticket")
        .setStyle("DANGER")

    switch (interaction.values[0]) {
        case "build":
            const build_ticket = new MessageEmbed()
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setColor("#fbab31")
                .setTitle("Ticket catégorisé")
                .setDescription("Votre ticket a bien été catégorisé comme une demande de build ! \nUne réponse vous sera apportée dès que possible !")
                .addField("Bonnes habitudes :", "Pour obtenir une réponse à votre question plus rapidement, n'oubliez d'indiquer dans ce salon un maximum de détail qui pourra aider notre équipe à vous aider tels que votre cahier des charges, votre budget, etc.")

            interaction.reply({
                embeds: [build_ticket],
                components: [
                    {
                        type: 1,
                        components: [
                            closeButton.toJSON()
                        ]
                    }
                ]
            });
        break;
    }
}