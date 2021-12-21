exports.run = (client, interaction) => {
    const config = require('../config.json');

    if (interaction.guild.members.cache.get(interaction.user.id).roles.cache.has(config.builds_roles)) {
        interaction.guild.members.cache.get(interaction.user.id).roles.remove(config.builds_roles);

        interaction.reply({ content: "Rôle enlevé avec succès !", ephemeral: true });
    } else {
        interaction.guild.members.cache.get(interaction.user.id).roles.add(config.builds_roles);

        interaction.reply({ content: "Rôle ajouté avec succès !", ephemeral: true });
    }
}