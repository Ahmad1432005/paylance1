const { EmbedBuilder } = require('discord.js');
const fs = require('fs/promises');
const path = require('path');

const bankFilePath = path.join(__dirname, '..', 'json', 'Bank.json');


function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

module.exports = {
  name: 'bank',
  description: 'Check the bank balance',
  async run(client, message, args) {
    
    try {
      const data = await fs.readFile(bankFilePath, 'utf-8');
      const bankData = JSON.parse(data);
      const bankAmount = bankData.fund || 0;

      const balanceEmbed = new EmbedBuilder()
        .setColor('C016FD')
        .setDescription(`💰 Bank balance: ${formatCurrency(bankAmount)}`);

      message.channel.send({ embeds: [balanceEmbed] });
    } catch (error) {
      console.error(error);
      const errorEmbed = new EmbedBuilder()
        .setColor('#FF00FF')
        .setDescription('⚠️ An error occurred while fetching the bank balance.');

      return message.channel.send({ embeds: [errorEmbed] });
    }
  }
};
        