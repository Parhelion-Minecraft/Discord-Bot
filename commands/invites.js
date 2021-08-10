exports.run = (client, interaction) => {
    const config = require('../config.json');

    const { MessageEmbed } = require("discord.js");
    const mysql = require('mysql');

    const connection = mysql.createConnection({
        host: "lraspberrypi.zapto.org",
        user: process.env.dbUsername,
        password: process.env.dbPassword,
        database: "parhelion"
    });

    switch (interaction.options.first().name) {
        case "count":
            connection.query(`SELECT invites FROM invites WHERE inviter=${interaction.user.id}`, function (error, results, fields) {
                let countEmbed = new MessageEmbed()
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setTitle(`Invitations de ${interaction.user.username}`)

                if (!results || !results[0]) {
                    countEmbed.setDescription(`Vous n'avez invité auucn membre sur notre serveur.`)
                
                    interaction.reply({
                        embeds: [countEmbed]
                    });
                } else {
                    countEmbed.setDescription(`Vous avez invité **${results[0].invites}** membres sur notre serveur. \n\nMerci à vous !`)
                
                    interaction.reply({
                        embeds: [countEmbed]
                    });
                }
            });
        break;

        case "top":
            connection.query("SELECT * FROM invites ORDER BY invites DESC LIMIT 5", function (error, results, fields) {
                let topEmbed = new MessageEmbed()
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setTitle("Leaderboard des invitations")

                results.forEach(element => {
                    console.log(element.inviter)
                    if (!client.guilds.cache.get(config.server_id).members.cache.get(element.inviter)) return;

                    topEmbed.addField(client.guilds.cache.get(config.server_id).members.cache.get(element.inviter).user.username, `**${element.invites}** invitations`)
                });

                interaction.reply({
                    embeds: [topEmbed]
                });
            });
        break;
    }
}