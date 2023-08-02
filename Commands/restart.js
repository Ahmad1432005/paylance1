const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'restart',
  description: 'Simulate the bot restart (fake).',
  run: async (client, message) => {
    const allowedRole = '1117378682395308033'; 
    const member = message.guild.members.cache.get(message.author.id);
    const hasAllowedRole = member.roles.cache.has(allowedRole);

    if (!hasAllowedRole) {
      const errorEmbed = new EmbedBuilder()
        .setColor('#C016FD')
        .setDescription('🚫 You are not authorized to use this command.');

      return message.channel.send({ embeds: [errorEmbed] });
    }

    const restartEmbed = new EmbedBuilder()
      .setColor('#C016FD')
      .setDescription('Restarting...');

    const restartMessage = await message.channel.send({ embeds: [restartEmbed] });

    // Simulate the restart by waiting for 3 seconds
    setTimeout(() => {
      if (message.channel.id === restartMessage.channel.id) {
        const restartedEmbed = new EmbedBuilder()
          .setColor('#00FF00')
          .setDescription('Successfully restarted with 0 errors.');

        message.channel.send({ embeds: [restartedEmbed] });
      }
    }, 3000);
  },
};
        