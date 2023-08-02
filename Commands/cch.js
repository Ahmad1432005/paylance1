const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'cch',
  aliases: ['customcmdhelp','cc'],
  run: async (client, message, args) => {
    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('How to Use Custom Commands')
      .setDescription('To use custom (server) emojis:\n<:(emojiname):(emojiID)>\n\nTo use animated emoji:\n<a:(emojiname):((emojiID)>\n\nIgnore the brackets.')
      .setFooter({text: 'Custom Command Help'});

    message.channel.send({ embeds: [embed] });
  },
};
