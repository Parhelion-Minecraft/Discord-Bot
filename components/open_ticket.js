exports.run = (client, interaction) => {
    const { MessageEmbed, MessageSelectMenu } = require('discord.js');

    const config = require('../config.json');

    if (client.guilds.cache.get(config.server_id).channels.cache.filter(channel => channel.name === interaction.user.id).first()) {
        const dupe = new MessageEmbed()
            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
            .setColor("#FF2200")
            .setTitle("Erreur")
            .setDescription("Vous ne pouvez ouvrir qu'un seul ticket à la fois.")

        return interaction.reply({ embeds: [dupe], ephemeral: true });
    }

    client.guilds.cache.get(config.server_id).channels.create(interaction.user.id, { parent: config.ticket_category })
        .then(channel => {
            channel.permissionOverwrites.create(interaction.user.id, { VIEW_CHANNEL: true, SEND_MESSAGES: true })
                .then(() => {
                    channel.permissionOverwrites.create(interaction.guild.id, { VIEW_CHANNEL: false });

                    const opened_ticket = new MessageEmbed()
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                        .setColor("#fbab31")
                        .setTitle("Ticket créé")
                        .setDescription(`Votre ticket a été créé : <#${channel.id}> \nVous recevrez d'ici peu un message vous invitant à le configurer.`)

                    interaction.reply({ embeds: [opened_ticket], ephemeral: true });

                    const select = new MessageSelectMenu()
                        .setCustomId("choose_ticket_reason")
                        .setPlaceholder("Pourquoi souhaitez-vous nous contacter ?")
                        .addOptions({ label: "Aide", value: "need_help", description: "Obtenir de l'aide à propos de nos services", emoji: "🙋" })
                        .addOptions({ label: "Partenariat", value: "partnership", description: "Nous proposer un partenariat", emoji: "🔗" })
                        .addOptions({ label: "Suggestion", value: "suggest", description: "Soumettre une suggestion à notre équipe", emoji: "💡" })
                        .addOptions({ label: "Bug", value: "bug", description: "Reporter un bug à notre équipe", emoji: "🐛" })
			.addOptions({ label: "Commande build", value: "build", "Passer commande d'un build", emoji: "🏗️");

                    const info = new MessageEmbed()
                        .setAuthor("Configuration ticket", client.user.displayAvatarURL())
                        .setColor("#fbab31")
                        .setDescription(`Bienvenue dans votre ticket cher ${interaction.user.username} ! \nAvant toute chose, merci de choisir pour quelle vous souhaitez contacter notre équipe !`)

                    channel.send({
                        content: `<@${interaction.user.id}>`,
                        embeds: [info],
                        components: [
                            {
                                type: 1,
                                components: [
                                    select.toJSON()
                                ]
                            }
                        ]
                    })
                });
        });
}
