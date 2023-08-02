const { EmbedBuilder } = require('discord.js');
const fs = require('fs/promises');
const path = require('path');

const filePath = path.join(__dirname, '..', 'json', 'Fund.json');


function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

module.exports = {
  name: 'checkbalance',
  description: 'Check the balance of a user',
  aliases: ["balance", "funds","check","bal"],
  async run(client, message, args) {
    let mention;
    if (args[0]) {
      mention = message.mentions.users.first() || client.users.cache.get(args[0]);
    } else {
      mention = message.author;
    }

    
    let fundData;
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      if (!data) {
        fundData = {};
      } else {
        fundData = JSON.parse(data);
      }
    } catch (error) {
      console.error(error);
      const errorEmbed = new EmbedBuilder()
        .setColor('#FF00FF')
        .setDescription('⚠️ An error occurred while reading the Fund data.');

      return message.channel.send({ embeds: [errorEmbed] });
    }

    const userBalance = fundData[mention.id]?.fund || 0;
    const balanceEmbed = new EmbedBuilder()
      .setColor('C016FD')
      .setDescription(`💰 ${mention.tag}'s balance: ${formatCurrency(userBalance)}`);

    message.channel.send({ embeds: [balanceEmbed] });
  }
};
          