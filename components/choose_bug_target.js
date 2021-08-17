exports.run = (client, interaction) => {
    const { MessageEmbed, MessageCollector } = require('discord.js');

    if (interaction.user.id != interaction.message.channel.name) {
        return interaction.reply({ content: "Vous ne pouvez interagir qu'avec les tickets que vous avez ouverts." });
    }

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
}