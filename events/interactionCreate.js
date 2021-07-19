module.exports = (client, interaction) => {
    const config = require('../config.json');
    const { MessageSelectMenu, MessageCollector } = require('discord.js');

    if (interaction.customId === "open_ticket") {
        if (client.guilds.cache.get(config.server_id).channels.cache.filter(channel => channel.name === interaction.user.id).first()) {
            return interaction.reply({ content: "Vous ne pouvez ouvrir qu'un seul ticket à la fois.", ephemeral: true });
        }

        client.guilds.cache.get(config.server_id).channels.create(interaction.user.id, { parent: config.ticket_category })
            .then(channel => {
                channel.permissionOverwrites.create(interaction.user.id, { VIEW_CHANNEL: true, SEND_MESSAGES: true })
                    .then(() => {
                        channel.permissionOverwrites.create(interaction.guild.id, { VIEW_CHANNEL: false });

                        interaction.reply({ content: `Voici votre ticket : <#${channel.id}> !`, ephemeral: true });

                        const select = new MessageSelectMenu()
                            .setCustomId("choose_ticket_reason")
                            .setPlaceholder("Pourquoi souhaitez-vous nous contacter ?")
                            .addOptions({ label: "Aide", value: "need_help", description: "Obtenir de l'aide à propos de nos services" })
                            .addOptions({ label: "Partenariat", value: "partnership", description: "Nous proposer un partenariat" })
                            .addOptions({ label: "Suggestion", value: "suggest", description: "Soumettre une suggestion à notre équipe" })
                            .addOptions({ label: "Bug", value: "bug", description: "Reporter un bug à notre équipe" })

                        channel.send({
                            content: `<@${interaction.user.id}>, bienvenue dans votre ticket ! \nNotre équipe en prendra connaissance dès que possible !`,
                            "components": [
                                {
                                    "type": 1,
                                    "components": [
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
                interaction.reply({ content: "Votre ticket a bien été catégorisé comme une demande d'aide ! \nLes membres de l'équipe de support viendra vous aider dès que possible !" });
            break;

            case "partnership":
                interaction.reply({ content: "Votre ticket a bien été catégorisé comme une demande de partenariat ! \nLes membres de l'équipe marketing viendra vous aider dès que possible !" });
            break;

            case "suggest":
                interaction.reply({ content: "Je suis tout ouïe, quelle est votre suggestion ? \n\nN'oubliez pas d'inclure un maximum de détail pour que notre équipe puisse y répondre au mieux !" });
            
                const collector = new MessageCollector(interaction.message.channel, { max: 2 });

                collector.on("collect", suggestion => {
                    if (suggestion.author.bot) return;

                    suggestion.channel.send("Merci pour votre suggestion ! \nVotre ticket sera automatiquement fermé dans 10 secondes ! \n\nGardez à l'esprit que notre équipe vient peut-être vous contacter pour en savoir plus sur votre suggestion !")
                    
                    setTimeout(() => {
                        suggestion.channel.delete();
                    }, 10000);
                });
            break;

            case "bug":
                interaction.reply({ content: "Je suis tout ouïe, quel est le bug que vous souhaitez ? \n\nN'oubliez pas d'inclure un maximum de détail pour que notre équipe puisse y répondre au mieux !" });
            break;
        }
    }
}