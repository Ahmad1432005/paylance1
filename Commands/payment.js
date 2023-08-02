const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'payment',
  run: async (client, message, args) => {
    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('payment')
      .setDescription(`Stripe
payment:
https://buy.stripe.com/aEUbIP9GB2iC1GwcMP`)
      .setFooter({text:'PayLance on top'});

    message.channel.send({ embeds: [embed] });
  },
};