exports.run = (client, interaction) => {
    const { MessageEmbed, MessageCollector } = require('discord.js');

    const { Octokit } = require("@octokit/core");

    const octokit = new Octokit({ auth: process.env.github_token });

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
                if (repo === undefined) {
                    switch (interaction.values[0]) {
                        case "discord_guild":
                            notionSug("Serveur Discord", sug.content);
                            break;

                        case "minecraft_server":
                            notionSug("Serveur Minecraft", sug.content);
                            break;
                    }
                } else {
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
                }
            });
        });

    function notionSug(tag, suggestion) {
        const { Client } = require("@notionhq/client")

        const notion = new Client({
            auth: process.env.notion_token
        });

        notion.pages.create({
            parent: {
                database_id: '5ccd6d50a0dd41708d51854dbb0b0c96',
            },
            properties: {
                Name: {
                    title: [
                        {
                            text: {
                                content: 'Suggestion',
                            }
                        }
                    ]
                },
                'Tags': {
                    multi_select: [{
                        name: tag,
                    }]
                }
            },
            children: [
                {
                    object: 'block',
                    type: 'heading_1',
                    heading_1: {
                        text: [
                            {
                                type: 'text',
                                text: {
                                    content: 'Suggestion',
                                }
                            }
                        ]
                    }
                },
                {
                    object: 'block',
                    type: 'paragraph',
                    paragraph: {
                        text: [
                            {
                                type: 'text',
                                text: {
                                    content: suggestion,
                                }
                            }
                        ]
                    }
                },
                {
                    object: 'block',
                    type: 'heading_1',
                    heading_1: {
                        text: [
                            {
                                type: 'text',
                                text: {
                                    content: 'Suggéré par',
                                }
                            }
                        ]
                    }
                },
                {
                    object: 'block',
                    type: 'paragraph',
                    paragraph: {
                        text: [
                            {
                                type: 'text',
                                text: {
                                    content: `${interaction.user.username}#${interaction.user.discriminator} (${interaction.user.id})`
                                }
                            }
                        ]
                    }
                },
            ]
        });

        const sug_posted = new MessageEmbed()
            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
            .setColor("#fbab31")
            .setTitle("Merci !")
            .setDescription(`Votre suggestion nous a bien été soumise ! Merci ! \n\nVotre ticket sera fermé automatiquement dans 10 secondes.`)

        interaction.message.channel.send({ embeds: [sug_posted] });

        setTimeout(() => {
            interaction.message.channel.delete();

            client.users.cache.get(interaction.message.channel.name).send({
                embeds: [
                    {
                        color: "#fbab31",
                        description: "Votre ticket de support a été fermé."
                    }
                ]
            });
        }, 10000);
    }
}
