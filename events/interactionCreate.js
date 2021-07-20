module.exports = (client, interaction) => {
    const config = require('../config.json');
    const { MessageEmbed, MessageSelectMenu, MessageCollector } = require('discord.js');

    const { Octokit } = require("@octokit/core");

    const octokit = new Octokit({ auth: process.env.github_token });

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
    } else if (interaction.customId === "choose_bug_target") {
        var repo;

        switch (interaction.values[0]) {
            case "twitch_bot":
                repo = "Twitch-Bot";
                break;

            case "discord_bot":
                repo = "Discord-Bot"
                break;
        }

        const bug_embed = new MessageEmbed()
            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
            .setColor("#fbab31")
            .setTitle("Je vous écoute !")
            .setDescription("Quel est le bug que vous souhaitez nous reporter ?")
            .addField("Quelles informations indiquer ?", "Nous vous demandons d'indiquer les étapes de reproduction du bug, quel est le résultat attendu ainsi que le résultat actuel.")
            .addField("Attention !", "Le bug sera automatiquement soumis à notre équipe après votre premier message sur ce salon. Merci donc d'inclure toutes les informations ci-dessus dans un seul message.")

        interaction.reply({ embeds: [bug_embed] })
            .then(() => {
                const collector = new MessageCollector(interaction.message.channel, { max: 1 });

                collector.on("collect", bug => {
                    octokit.request(`POST /repos/Parhelion-Minecraft/${repo}/issues`, {
                        owner: 'Parhelion-Minecraft',
                        repo: repo,
                        title: 'Bug',
                        body: `# Bug\n${bug.content}\n# Reported by\n**Tag** : \`${interaction.user.username}#${interaction.user.discriminator}\`\n**ID** : \`${interaction.user.id}\``
                    }).then(res => {
                        const bug_posted = new MessageEmbed()
                            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                            .setColor("#fbab31")
                            .setTitle("Merci !")
                            .setDescription(`Votre bug nous a bien été reporté ! \nVous pouvez l'avancée de son traitement [ici](https://github.com/Parhelion-Minecraft/${repo}/issues/${res.data.number}) ! \n\nVotre ticket sera fermé automatiquement dans 10 secondes.`)

                        bug.channel.send({ embeds: [bug_posted] });

                        setTimeout(() => {
                            bug.channel.delete();

                            client.users.cache.get(bug.channel.name).send({
                                embeds: [
                                    {
                                        color: "#fbab31",
                                        description: "Votre ticket de support a été fermé."
                                    }
                                ]
                            });
                        }, 10000);
                    });
                });
            });
    } else if (interaction.customId === "choose_sug_target") {
        var repo;

        switch (interaction.values[0]) {
            case "twitch_bot":
                repo = "Twitch-Bot";
                break;

            case "discord_bot":
                repo = "Discord-Bot"
                break;
        }

        const sug_embed = new MessageEmbed()
            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
            .setColor("#fbab31")
            .setTitle("Je vous écoute !")
            .setDescription("Quel est la suggestion que vous souhaitez nous soumettre ?")
            .addField("Attention !", "La suggestion sera automatiquement soumise à notre équipe après votre premier message sur ce salon. Merci donc d'inclure toutes les informations souhaitées dans un seul message.")

        interaction.reply({ embeds: [sug_embed] })
            .then(() => {
                const collector = new MessageCollector(interaction.message.channel, { max: 1 });

                collector.on("collect", sug => {
                    octokit.request(`POST /repos/Parhelion-Minecraft/${repo}/issues`, {
                        owner: 'Parhelion-Minecraft',
                        repo: repo,
                        title: 'Suggestion',
                        body: `# Suggestion\n${sug.content}\n# Reported by\n**Tag** : \`${interaction.user.username}#${interaction.user.discriminator}\`\n**ID** : \`${interaction.user.id}\``
                    }).then(res => {
                        const sug_posted = new MessageEmbed()
                            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                            .setColor("#fbab31")
                            .setTitle("Merci !")
                            .setDescription(`Votre suggestion nous a bien été soumise ! \nVous pouvez l'avancée de son traitement [ici](https://github.com/Parhelion-Minecraft/${repo}/issues/${res.data.number}) ! \n\nVotre ticket sera fermé automatiquement dans 10 secondes.`)

                        sug.channel.send({ embeds: [sug_posted] });

                        setTimeout(() => {
                            sug.channel.delete();

                            client.users.cache.get(sug.channel.name).send({
                                embeds: [
                                    {
                                        color: "#fbab31",
                                        description: "Votre ticket de support a été fermé."
                                    }
                                ]
                            });
                        }, 10000);
                    });
                });
            });
    }
}