const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'customcmd',
  run: async (client, message, args) => {
    if (!message.member.roles.cache.has('1124272258450464778')) {
      return message.channel.send("You don't have permission to use this command.");
    }

    const input = message.content.slice(message.content.indexOf(' ') + 1).trim(); // Extract the input after the command name and remove extra spaces
    const [commandName, ...responseParts] = input.match(/(?:\*\*.*?\*\*|\|\|.*?\|\||```[\s\S]*?```|`[\s\S]*?`|[^ ]+)/g); // Match different patterns for the response

    if (!commandName) {
      return message.channel.send("Please provide the name of the command.");
    }

    if (!responseParts.length) {
      return message.channel.send("Please provide the response for the command.");
    }

    // Join the response parts back together with spaces
    const commandResponse = responseParts.join(' ');

    // Add escape characters before backticks or other special characters
    const escapedResponse = commandResponse.replace(/([`])/g, '\\$1');

    const lowercaseCommandName = commandName.toLowerCase(); // Convert commandName to lowercase
    const commandFilePath = path.join(__dirname, '..', 'Commands', `${lowercaseCommandName}.js`);

    // Check if a command with the same name already exists
    if (fs.existsSync(commandFilePath)) {
      return message.channel.send(`A command with the name '${commandName}' already exists.`);
    }

    const commandCode = `module.exports = {
  name: '${commandName}',
  run: async (client, message, args) => {
    message.channel.send(\`${escapedResponse}\`);
  },
};`;

    try {
      fs.writeFileSync(commandFilePath, commandCode);
      message.channel.send(`Created command '${commandName}'!`);

      // Reload all commands after creating the new command.
      const commandFiles = fs.readdirSync(path.join(__dirname, '../Commands')).filter(file => file.endsWith('.js'));

      for (const file of commandFiles) {
        const command = require(`../Commands/${file}`);
        client.commands.set(command.name, command);
      }

      message.channel.send('All commands have been reloaded.');
    } catch (error) {
      console.error(error);
      message.channel.send(`Failed to create command '${commandName}'.`);
    }
  },
};
        