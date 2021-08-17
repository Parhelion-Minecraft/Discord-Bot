exports.run = (client, interaction) => {
    const { MessageEmbed } = require('discord.js');

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