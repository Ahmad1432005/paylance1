const { EmbedBuilder } = require('discord.js');
const fs = require('fs/promises');
const path = require('path');

const allowedRoles = ['1117378682395308033', '1117378749743251466']; // Role IDs of allowed roles
const filePath = path.join(__dirname, '..', 'json', 'Bank.json');
const paymentLogChannelId = '1134704659748102154';

function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

module.exports = {
  name: 'bw',
  description: 'Withdraws an amount from the bank.',
  async run(client, message, args) {
    const member = message.guild.members.cache.get(message.author.id);
    const hasAllowedRole = allowedRoles.some(roleId => member.roles.cache.has(roleId));

    if (!hasAllowedRole) {
      const errorEmbed = new EmbedBuilder()
        .setColor('#C016FD')
        .setDescription('🚫 You are not authorized to use this command.');

      return message.channel.send({ embeds: [errorEmbed] });
    }

    let amount = parseFloat(args[0]);
    const reason = args.slice(1).join(' ');

    if (isNaN(amount) || amount <= 0 || !reason) {
      const errorEmbed = new EmbedBuilder()
        .setColor('#C016FD')
        .setDescription('Please use the command in this format:\n !bw (withdraw amount) (reason)');

      return message.channel.send({ embeds: [errorEmbed] });
    }

    let bankData;
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      if (!data) {
        bankData = { fund: 0 };
      } else {
        bankData = JSON.parse(data);
      }
    } catch (error) {
      console.error(error);
      const errorEmbed = new EmbedBuilder()
        .setColor('#C016FD')
        .setDescription('⚠️ An error occurred while reading the Bank data.');

      return message.channel.send({ embeds: [errorEmbed] });
    }

    if (amount > bankData.fund) {
      const errorEmbed = new EmbedBuilder()
        .setColor('#C016FD')
        .setDescription('⚠️ Insufficient funds in the bank.');

      return message.channel.send({ embeds: [errorEmbed] });
    }

    bankData.fund -= amount;
    try {
      await fs.writeFile(filePath, JSON.stringify(bankData, null, 2));

      const successEmbed = new EmbedBuilder()
        .setColor('#C016FD')
        .setDescription(`<a:pepe_money:1119546474804559922> __**${amount}$**__ has been withdrawn!\n\n<:info:1124955310092726383> **Reason**: ${reason}`)
        .setFooter({ text: `Remaining Funds: ${bankData.fund}$` });

      message.channel.send({ embeds: [successEmbed] });

      // Log
      const paymentLogChannel = message.guild.channels.cache.get(paymentLogChannelId);
      if (paymentLogChannel) {
        const logEmbed = new EmbedBuilder()
          .setColor('#C016FD')
          .setDescription(`\u200B\n${message.author} Withdrew ${amount}$ from the bank\n\n<:info:1124955310092726383> **Reason**: ${reason}`);

        paymentLogChannel.send({ embeds: [logEmbed] });
      }
    } catch (err) {
      console.error('Error writing to bank file:', err);
      const errorEmbed = new EmbedBuilder()
        .setColor('#C016FD')
        .setDescription('An error occurred while processing the request.');

      return message.channel.send({ embeds: [errorEmbed] });
    }
  },
};
                                                   