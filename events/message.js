module.exports = (client, message) => {
    const config = require('../config.json');
    const { MessageEmbed } = require('discord.js');

    if (message.channel.id === config.poll_channel) {
        const emojis = ["✔️", "❌"];

        emojis.forEach((element, i) => {
            setTimeout(() => {
                message.react(element)
            }, 200 * i);
        });
    }

    if (message.author.bot) return;

    const args = message.content.replace('pm.', '').split(' ');
    const command = args[0];

    const prefix = "pm.";

    if (!message.content.startsWith(prefix)) return;

    const cmd = client.commands.get(command);

    if (!cmd) {
        const noexist_cmd = new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setColor('#FF2200')
            .setTitle('Commande inexistante')
            .setDescription('Vous avez tenté d\'exécuter une commande inexistante.')
            .setTimestamp()

        return message.channel.send(noexist_cmd);
    }

    cmd.run(client, message, args);
};