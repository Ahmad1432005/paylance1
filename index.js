const mySecret = process.env.token;
const express = require("express");
const app = express();

app.listen(3000, () => {
  console.log("project is running!");
});

const Discord = require("discord.js");
const client = new Discord.Client({
  intents: ['Guilds', 'GuildMessages', 'MessageContent', 'DirectMessages'],
  partials: ['USER']
});

const { EmbedBuilder } = require('discord.js');

const Database = require("@replit/database");
const db = new Database();
const fs = require("fs");
const prefix = "!";

client.commands = new Map();
client.aliases = new Map();

const commands = fs.readdirSync("./Commands/").filter(file => file.endsWith('.js'));
for (const file of commands) {
  const commandName = file.split(".")[0];
  const command = require(`./Commands/${commandName}`);
  client.commands.set(command.name, command);

  if (command.aliases && Array.isArray(command.aliases)) {
    for (const alias of command.aliases) {
      client.aliases.set(alias, command.name);
    }
  }
}

client.on("messageCreate", async message => {
  if (message.content.startsWith(prefix)) {
    const exampleEmbed = new EmbedBuilder()
      .setColor('#FF00FF')
      .setTitle('Error')
      .setDescription('That command doesn\'t exist. please type !help to see the list of commands.')
      .setFooter({ text: 'PayLance on top!' });

    const args = message.content.toLowerCase().slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift();
    const command = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));

    if (!command) return message.channel.send({ embeds: [exampleEmbed] });

    try {
      command.run(client, message, args);
    } catch (error) {
      console.error(error);
      message.reply("An error occurred while executing the command. Please try again later.");
    }
  }
});

client.on("ready", () => {
  const status = { type: "PLAYING", name: "PayLance" };
  client.user.setActivity(status.name, { type: status.type });
});

client.login(mySecret);
  