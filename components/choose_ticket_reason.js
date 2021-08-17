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
        case "need_help":
            const help_ticket = new MessageEmbed()
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setColor("#fbab31")
                .setTitle("Ticket catégorisé")
                .setDescription("Votre ticket a bien été catégorisé comme une demande d'aide ! \nUne réponse vous sera apportée dès que possible !")
                .addField("Bonnes habitudes :", "Pour obtenir une réponse à votre question plus rapidement, n'oubliez d'indiquer dans ce salon un maximum de détail qui pourra aider notre équipe à vous aider.")

            interaction.reply({
                embeds: [help_ticket],
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

        case "partnership":
            const partner_ticket = new MessageEmbed()
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setColor("#fbab31")
                .setTitle("Ticket catégorisé")
                .setDescription("Votre ticket a bien été catégorisé comme une demande de partenariat ! \nUne réponse vous sera apportée dès que possible !")
                .addField("Bonnes habitudes :", "Pour obtenir une réponse à votre proposition plus rapidement, n'oubliez d'indiquer dans ce salon un maximum de détail qui pourra aider notre équipe à vous donner son verdict.")

            interaction.reply({
                embeds: [partner_ticket],
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

        case "suggest":
            const sug_embed = new MessageEmbed()
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setColor("#fbab31")
                .setTitle("Une dernière question")
                .setDescription("Lequel de nos services est concerné par votre suggestion ?")

            const select_sug = new MessageSelectMenu()
                .setCustomId("choose_sug_target")
                .setPlaceholder("Quel service est concerné par votre suggestion ?")
                .addOptions({ label: "Bot Discord", value: "discord_bot", description: "Le bot Parhelion Bot sur notre serveur Discord", emoji: "🤖" })
                .addOptions({ label: "Bot Twitch", value: "twitch_bot", description: "Le bot Parhelion Bot sur notre chaîne Twitch", emoji: "🤖" })

            interaction.reply({
                embeds: [sug_embed],
                components: [
                    {
                        type: 1,
                        components: [
                            select_sug.toJSON()
                        ]
                    }
                ]
            });
            break;

        case "bug":
            const bug_embed = new MessageEmbed()
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setColor("#fbab31")
                .setTitle("Une dernière question")
                .setDescription("Lequel de nos services est concerné par votre bug ?")

            const select_bug = new MessageSelectMenu()
                .setCustomId("choose_bug_target")
                .setPlaceholder("Quel service est concerné par votre bug ?")
                .addOptions({ label: "Bot Discord", value: "discord_bot", description: "Le bot Parhelion Bot sur notre serveur Discord", emoji: "🤖" })
                .addOptions({ label: "Bot Twitch", value: "twitch_bot", description: "Le bot Parhelion Bot sur notre chaîne Twitch", emoji: "🤖" })

            interaction.reply({
                embeds: [bug_embed],
                components: [
                    {
                        type: 1,
                        components: [
                            select_bug.toJSON()
                        ]
                    }
                ]
            });
            break;
    }
}