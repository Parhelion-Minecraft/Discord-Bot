module.exports = (client, interaction) => {
    const config = require('../config.json');
    const { MessageEmbed, MessageSelectMenu, MessageCollector } = require('discord.js');

    if (interaction.customId === "open_ticket") {
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
    } else if (interaction.customId === "choose_ticket_reason") {
        switch (interaction.values[0]) {
            case "need_help":
                const help_ticket = new MessageEmbed()
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setColor("#fbab31")
                    .setTitle("Ticket catégorisé")
                    .setDescription("Votre ticket a bien été catégorisé comme une demande d'aide ! \nUne réponse vous sera apportée dès que possible !")
                    .addField("Bonnes habitudes :", "Pour obtenir une réponse à votre question plus rapidement, n'oubliez d'indiquer dans ce salon un maximum de détail qui pourra aider notre équipe à vous aider.")

                interaction.reply({ embeds: [help_ticket] });
            break;

            case "partnership":
                const partner_ticket = new MessageEmbed()
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setColor("#fbab31")
                    .setTitle("Ticket catégorisé")
                    .setDescription("Votre ticket a bien été catégorisé comme une demande de partenariat ! \nUne réponse vous sera apportée dès que possible !")
                    .addField("Bonnes habitudes :", "Pour obtenir une réponse à votre proposition plus rapidement, n'oubliez d'indiquer dans ce salon un maximum de détail qui pourra aider notre équipe à vous donner son verdict.")

                interaction.reply({ embeds: [partner_ticket] });
            break;

            case "suggest":
                const suggestion_ticket = new MessageEmbed()
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setColor("#fbab31")
                    .setTitle("Ticket catégorisé")
                    .setDescription("Votre ticket a bien été catégorisé comme une soumission de suggestions ! \nUne réponse vous sera apportée dès que possible !")
                    .addField("Bonnes habitudes :", "Pour obtenir une réponse à votre suggestion plus rapidement, n'oubliez d'indiquer dans ce salon un maximum de détail qui pourra aider notre équipe à vous donner son verdict.")

                interaction.reply({ embeds: [suggestion_ticket] });
            break;

            case "bug":
                const bug_ticket = new MessageEmbed()
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setColor("#fbab31")
                    .setTitle("Ticket catégorisé")
                    .setDescription("Votre ticket a bien été catégorisé comme un report de bug ! \nUne réponse vous sera apportée dès que possible !")
                    .addField("Bonnes habitudes :", "Pour obtenir permettre la résolution de votre bug le plus rapidement possible, n'oubliez d'indiquer dans ce salon un maximum de détail qui pourra aider notre équipe à le résoudre.")

                interaction.reply({ embeds: [bug_ticket] });
            break;
        }
    }
}