const { EmbedBuilder } = require('discord.js');
const fs = require('fs/promises');
const path = require('path');

const allowedRoles = ['1117378682395308033', '1124272258450464778', '1117378749743251466']; // IDs of allowed roles
const filePath = path.join(__dirname, '..', 'json', 'Fund.json');
const bankFilePath = path.join(__dirname, '..', 'json', 'Bank.json');
const paymentLogChannelId = '1134704659748102154';
function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

module.exports = {
  name: 'addfund',
  description: 'Add Fund to a user',
  aliases: ["f+", "add", "pay"],
  async run(client, message, args) {
    const member = message.guild.members.cache.get(message.author.id);
    const allowedRole = member.roles.cache.some(role => allowedRoles.includes(role.id));
    if (!allowedRole) {
      const errorEmbed = new EmbedBuilder()
        .setColor('#C016FD')
        .setDescription('🚫 You do not have permission to use this command.');

      return message.channel.send({ embeds: [errorEmbed] });
    }

    let mention;
    if (args[0]) {
      mention = message.mentions.users.first() || client.users.cache.get(args[0]);
    }
    const amount = parseFloat(args[1]);
    const reason = args.slice(2).join(' ');

    if (!mention || isNaN(amount) || amount <= 0 || !reason) {
      const errorEmbed = new EmbedBuilder()
        .setColor('#C016FD')
        .setDescription('Please use the command in this format:\n !f+ @user (fundamount) (reason)');

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

    if (!fundData[mention.id]) {
      fundData[mention.id] = {
        id: mention.id,
        fund: 0,
      };
    }

    
    const amountToBank = Math.ceil(amount * 0.15 * 100) / 100;
    
    fundData[mention.id].fund += (amount - amountToBank);
    fundData['server'] = (fundData['server'] || 0) + amountToBank;

    
    try {
      await fs.writeFile(filePath, JSON.stringify(fundData, null, 2));
      await fs.writeFile(bankFilePath, JSON.stringify({ fund: fundData['server'] }, null, 2));

      const targetUserData = fundData[mention.id];
      const successEmbed = new EmbedBuilder()
        .setColor('#C016FD')
        .setDescription(`\u200B\n<a:correct:1122054579706671144> Successfully added ${formatCurrency(amount)} USD fund to ${mention.tag} for **${reason}**\n\nAmount added to the user: ${formatCurrency(amount - amountToBank)}\nAmount sent to the bank: ${formatCurrency(amountToBank)}`);

      message.channel.send({ embeds: [successEmbed] });

      // Send a direct msg
      const dmEmbed = new EmbedBuilder()
        .setColor('#C016FD')
        .setDescription(`<a:money:1119551883263090778> ${formatCurrency(amount - amountToBank)} has been added to your wallet for ${reason}\n\n**15% seller tax**: ${formatCurrency(amountToBank)}`)
        .setFooter({ text: `Your total fund: ${formatCurrency(targetUserData.fund)}` });

      await mention.send({ embeds: [dmEmbed] });

      // Log
      const paymentLogChannel = message.guild.channels.cache.get(paymentLogChannelId);
      if (paymentLogChannel) {
        const logEmbed = new EmbedBuilder()
          .setColor('#C016FD')
          .setDescription(`\u200B\n${message.author} Added funds to ${mention}\n\n<:info:1124955310092726383> **Reason**: ${reason}\nAmount added to the user: ${formatCurrency(amount - amountToBank)}\nAmount sent to the bank: ${formatCurrency(amountToBank)}`);

        paymentLogChannel.send({ embeds: [logEmbed] });
      }
    } catch (error) {
      console.error(error);
      const errorEmbed = new EmbedBuilder()
        .setColor('#C016FD')
        .setDescription('⚠️ An error occurred while adding fund.');

      return message.channel.send({ embeds: [errorEmbed] });
    }
  },
};
      //made by savenge