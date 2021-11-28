const { MessageEmbed } = require('discord.js');

module.exports = (client, message) => {
    const config = require('../config.json');

    if (message.channel.id === config.introduction_channel) {
        message.react("👋");
    }

    if (message.channel.id === config.poll_channel) {
        const emojis = ["✔️", "❌"];

        emojis.forEach((element, i) => {
            setTimeout(() => {
                message.react(element)
            }, 200 * i);
        });
    }

    if (message.author.bot) return;

    const mysql = require('mysql');

    const connection = new mysql.createConnection({
        host: process.env.dbHost,
        user: process.env.dbUsername,
        password: process.env.dbPassword,
        database: "parhelion"
    });

    connection.query(`SELECT * FROM messages_sent WHERE user="${message.author.id}"`, function (error, results, fields) {
        if (!results || !results[0]) {
            connection.query(`INSERT INTO messages_sent (user, messages_sent) VALUES (${message.author.id}, "1")`);
        } else {
            if (parseInt(results[0]["messages_sent"]) + 1 === 50) {
                client.guilds.cache.get(config.server_id).members.cache.get(message.author.id).roles.add(config.publicity_role);

                const pub_embed = new MessageEmbed()
                    .setColor("#f57e2c")
                    .setTitle("Ceci est un votre cinquantième message !")
                    .setDescription("Vous avez maintenant accès à <#863020996548886568> !")

                message.reply({ embeds: [pub_embed] });
            }

            connection.query(`UPDATE messages_sent SET messages_sent=${parseInt(results[0]["messages_sent"]) + 1} WHERE user=${message.author.id}`)
        }
    });
};