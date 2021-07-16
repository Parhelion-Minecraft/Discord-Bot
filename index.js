const Discord = require("discord.js");
const bot = new Discord.Client();
require("dotenv").config();
const fs = require("fs");
const cli = require("cli-colors");
const { PREFIX } = require("./source/essentials/config.js");

bot.login(process.env.TOKEN);

bot.commands = new Discord.Collection();
fs.readdir("./source/commands/", (error, f) => {
  if (error) console.log(cli.red(error));

  let commandes = f.filter((f) => f.split(".").pop() === "js");
  if (commandes.length <= 0)
    return console.log(cli.red("[ERROR] Aucunes commandes trouvées"));

  commandes.forEach((f) => {
    let commande = require(`./source/commands/${f}`);
    console.log(cli.green(`[COMMANDE] → ${f} commande chargée`));
    bot.commands.set(commande.help.name, commande);
  });
});

fs.readdir("./source/events/", (error, f) => {
  if (error) console.log(cli.red(error));
  console.log(cli.yellow(`[EVENT] → ${f.length} events chargés`));
  console.log("------------------------------------");

  f.forEach((f) => {
    const events = require(`./source/events/${f}`);
    const event = f.split(".")[0];

    bot.on(event, events.bind(null, bot));
  });
});
