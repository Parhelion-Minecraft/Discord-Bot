const Discord = require("discord.js");
const { PREFIX } = require("../essentials/config");

module.exports = async (bot, message) => {
  if (message.content.toLowerCase().startsWith(PREFIX)) {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args[0];
    const cmd = bot.commands.find(
      (cmd) =>
        cmd.help.name === commandName || cmd.help.alias?.includes(commandName)
    );

    if (!cmd) {
      return;
    } else if (cmd.help.status == "off") {
      return message.channel.send(
        "La commande n'est pas disponible ou en maintenance. Merci de patienter !"
      );
    } else {
      try {
        await cmd.run(bot, message, args);
      } catch (error) {
        message.react("❌");
        message.channel.send(
          "Une erreur à eu lieu, le staff à été prevenu merci de patienter le problème va bientôt être corrigé."
        );
        console.log(error);
      }
    }
  } else {
    return;
  }
};
