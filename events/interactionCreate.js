module.exports = (client, interaction) => {
    if (interaction.isCommand()) {
        const commandName = interaction.commandName;

        const command = client.commands.get(commandName);

        if (!command) return;

        command.run(client, interaction);
    } else if (interaction.isMessageComponent()) {
        const customID = interaction.customId;

        const component = client.components.get(customID);

        if (!component) return;

        component.run(client, interaction);
    }
}