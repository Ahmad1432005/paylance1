const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'reload',
  description: 'Reloads all commands',
  run(client, message, args) {
    if (!message.member.roles.cache.has('1124272258450464778')) {//1117378682395308033
      return message.channel.send("You don't have permission to use this command.");
    }

    try {
      // Reload all commands.
      const commandFiles = fs.readdirSync(path.join(__dirname, '../Commands')).filter(file => file.endsWith('.js'));

      for (const file of commandFiles) {
        const commandName = file.split('.')[0];
        delete require.cache[require.resolve(`../Commands/${file}`)];
        const command = require(`../Commands/${file}`);
        client.commands.set(commandName, command);
      }

      message.channel.send('All commands have been reloaded.');
    } catch (error) {
      console.error(error);
      message.channel.send('An error occurred while reloading commands.');
    }
  },
};
      