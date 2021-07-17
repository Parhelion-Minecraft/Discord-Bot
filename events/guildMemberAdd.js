module.exports = (client, member) => {
    const config = require('../config.json');
    const { MessageEmbed } = require('discord.js');

    const greating_embed = new MessageEmbed()
        .setAuthor("Parhelion", member.guild.iconURL())
        .setTitle("Bienvenue !")
        .setDescription(`<@${member.user.id}> vient de rejoindre **Parhelion Minecraft** ! \nAccueillez-le comme il se doit !`)
        .setThumbnail(member.user.displayAvatarURL())

    client.channels.cache.get(config.greatings_channel).send(greating_embed);

    member.guild.members.cache.get(member.user.id).roles.add(config.member_role);
}