module.exports = (client, member) => {
    const config = require('../config.json');
    const { MessageEmbed } = require('discord.js');
    const fs = require('fs');
    const mysql = require('mysql');

    const connection = new mysql.createConnection({
        host: "lraspberrypi.zapto.org",
        user: process.env.dbUsername,
        password: process.env.dbPassword,
        database: "parhelion"
    });

    member.guild.members.cache.get(member.user.id).roles.add(config.member_role);

    client.guilds.cache.get(config.server_id).invites.fetch().then(guildInvites => {
        let invites = []

        const ei = JSON.parse(fs.readFileSync("invites/cache.json").toString());
        const usedInvite = ei.filter(invite => invite.uses < guildInvites.get(invite.code).uses)[0].code;

        const greeting_embed = new MessageEmbed()
            .setAuthor("Parhelion", member.guild.iconURL())
            .setTitle("Bienvenue !")
            .setThumbnail(member.user.displayAvatarURL())

        if (!usedInvite) {
            greeting_embed.setDescription(`<@${member.user.id}> vient de rejoindre **Parhelion Minecraft** ! \nAccueillez-le comme il se doit ! \n\nJe n'ai pas pu determiner par qui il a été invité. \n\n Je t'invite à consulter le salon <#871449994773807115> pour en apprendre plus sur Parhelion ! Tu peux aussi te renseigner sur le concours en cours grâce à la commande \`/concours\` !`);
        } else {
            const invite = guildInvites.get(usedInvite);

            greeting_embed.setDescription(`<@${member.user.id}> vient de rejoindre **Parhelion Minecraft** ! \nAccueillez-le comme il se doit ! \n\nIl a été invité par **${invite.inviter.username}**. Merci à lui ! \n\n Je t'invite à consulter le salon <#871449994773807115> pour en apprendre plus sur Parhelion ! Tu peux aussi te renseigner sur le concours en cours grâce à la commande \`/concours\` !`);

            client.channels.fetch(config.greetings_channel)
                .then(channel => {
                    channel.send({ embeds: [greeting_embed] })
                        .then(() => {
                            guildInvites.forEach(invite => {
                                invites.push({ code: invite.code, inviter: invite.inviter.id, uses: invite.uses })
                            });

                            connection.query(`SELECT * FROM invites WHERE inviter=${invite.inviter.id}`, function (error, results, fields) {
                                if (!results || !results[0]) {
                                    connection.query(`INSERT INTO invites (inviter, invites) VALUES (${invite.inviter.id}, "1")`);
                                } else {
                                    let cInvites = results[0]["invites"];

                                    connection.query(`UPDATE invites SET invites="${++cInvites}" WHERE inviter=${invite.inviter.id}`);
                                }
                            });

                            fs.writeFileSync("invites/cache.json", JSON.stringify(invites));
                        });
                });
        }
    });
}