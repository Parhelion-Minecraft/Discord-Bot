const Discord = require("discord.js");
const { PREFIX } = require("../essentials/config");

module.exports.run = async (bot, message, args) => {
  var cmds = [];
  bot.commands.forEach((cmd) => {
    if (cmd.help.category !== "noHelp" || !cmd.help.category) {
      alias = cmd.help.alias;
      cmds.push(
        `**➜ \`${cmd.help.name}\`**:\n*${cmd.help.description}*.`
        //  ${emoji[cmd.help.status]}
        // \nAlias: \`${alias.join(", ")}\`
      );
    }
  });

  const hh = new Discord.MessageEmbed()
    .setColor("#ffffff")
    .setDescription(
      "➜ Toutes mes commandes sont à utiliser avec le préfix : `" +
        PREFIX +
        "` !\n\n" +
        cmds.join("\n\n")
    )
    .setThumbnail(bot.user.displayAvatarURL())
    .setFooter("Made with ❤ by ! Yublo#0001");

  message.channel.send(hh);
};

module.exports.help = {
  name: "help",
  description: "Afficher la page d'aide",
  alias: ["hh", "h"],
  category: "noHelp",
  status: "on",
};
