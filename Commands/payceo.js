const { EmbedBuilder } = require('discord.js');
const fs = require('fs/promises');
const path = require('path');

const allowedRole = '1117378682395308033'; 
const filePath = path.join(__dirname, '..', 'json', 'Fund.json');
const bankFilePath = path.join(__dirname, '..', 'json', 'Bank.json');
const paymentLogChannelId = '1134704659748102154';

function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

module.exports = {
  name: 'payceo',
  description: 'Pay 35% of the bank funds to the CEO.',
  async run(client, message, args) {
    
    const member = message.guild.members.cache.get(message.author.id);
    const hasAllowedRole = member.roles.cache.has(allowedRole);
    if (!hasAllowedRole) {
      const errorEmbed = new EmbedBuilder()
        .setColor('#C016FD')
        .setDescription('🚫 You are not authorized to use this command.');

      return message.channel.send({ embeds: [errorEmbed] });
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
        .setColor('#C016FD')
        .setDescription('⚠️ An error occurred while reading the Fund data.');

      return message.channel.send({ embeds: [errorEmbed] });
    }

    const bankData = JSON.parse(await fs.readFile(bankFilePath, 'utf-8'));
    const bankFund = parseFloat(bankData.fund) || 0;
    const amountToCeo = Math.ceil(bankFund * 0.35 * 100) / 100;

    if (amountToCeo <= 0) {
      const errorEmbed = new EmbedBuilder()
        .setColor('#C016FD')
        .setDescription('⚠️ The bank does not have sufficient funds to transfer to the CEO.');

      return message.channel.send({ embeds: [errorEmbed] });
    }

    
    fundData['533390688424034324'] = (fundData['533390688424034324'] || { fund: 0 });
    fundData['533390688424034324'].fund = parseFloat((fundData['533390688424034324'].fund + amountToCeo).toFixed(2));
  
    bankData.fund = parseFloat((bankFund - amountToCeo).toFixed(2)); 

  
    try {
      await fs.writeFile(filePath, JSON.stringify(fundData, null, 2));
      await fs.writeFile(bankFilePath, JSON.stringify(bankData, null, 2));

      // Log
      const paymentLogChannel = message.guild.channels.cache.get(paymentLogChannelId);
      if (paymentLogChannel) {
        const logEmbed = new EmbedBuilder()
          .setColor('#C016FD')
          .setDescription(`\u200B\n<@${message.author.id}> Paid ${formatCurrency(amountToCeo)} to the CEO\n\n<:info:1124955310092726383> **Reason**: ${args.join(' ')}`);

        paymentLogChannel.send({ embeds: [logEmbed] });
      }

      const successEmbed = new EmbedBuilder()
        .setColor('#C016FD')
        .setDescription(`<a:correct:1122054579706671144> Successfully transferred ${formatCurrency(amountToCeo)} to the CEO.`);

      message.channel.send({ embeds: [successEmbed] });
    } catch (error) {
      console.error(error);
      const errorEmbed = new EmbedBuilder()
        .setColor('#C016FD')
        .setDescription('⚠️ An error occurred while processing the payment.');

      return message.channel.send({ embeds: [errorEmbed] });
    }
  },
};
  