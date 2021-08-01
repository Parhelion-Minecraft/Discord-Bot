exports.run = (client, interaction) => {
    interaction.channel.delete();

    client.users.cache.get(interaction.channel.name).send({
        embeds: [
            {
                color: "#fbab31",
                description: "Votre ticket de support a été fermé."
            }
        ]
    });
}