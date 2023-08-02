const { EmbedBuilder } = require('discord.js');
const fs = require('fs/promises');
const path = require('path');

const allowedRoles = ['1117378682395308033', '1124272258450464778', '1124008266188468254','1117378749743251466']; 
const filePath = path.join(__dirname, '..', 'json', 'Fund.json');
const paymentLogChannelId = '1134704659748102154';
function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}


module.exports = {
  name: 'removefund',
  description: 'Remove Fund from a user',
  aliases: ["f-", "remove"],
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
        .setDescription('Please use the command in this format:\n !f- @user (fundamount) (reason)');

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

    if (!fundData[mention.id] || amount > fundData[mention.id].fund) {
      const errorEmbed = new EmbedBuilder()
        .setColor('#C016FD')
        .setDescription('⚠️ The user does not have sufficient funds.');

      return message.channel.send({ embeds: [errorEmbed] });
    }

    fundData[mention.id].fund -= amount;
    // Update the server's fund value (after adding the removed fund)
    fundData['server'] = (fundData['server'] || 0) + amount;

    // Save the updated Fund.json to the file
    try {
      await fs.writeFile(filePath, JSON.stringify(fundData, null, 2));

      const successEmbed = new EmbedBuilder()
        .setColor('#C016FD')
        .setDescription(`\u200B\n<a:correct:1122054579706671144> Successfully removed ${formatCurrency(amount)} USD fund from ${mention.tag} for **${reason}**`);

      message.channel.send({ embeds: [successEmbed] });

      // Log
      const paymentLogChannel = message.guild.channels.cache.get(paymentLogChannelId);
      if (paymentLogChannel) {
        const logEmbed = new EmbedBuilder()
          .setColor('#C016FD')
          .setDescription(`\u200B\n${message.author} Removed funds from ${mention}\n\n<:info:1124955310092726383> **Reason**: ${reason}\nAmount removed from the user: ${formatCurrency(amount)}`);

        paymentLogChannel.send({ embeds: [logEmbed] });
      }
    } catch (error) {
      console.error(error);
      const errorEmbed = new EmbedBuilder()
        .setColor('#C016FD')
        .setDescription('⚠️ An error occurred while removing fund.');

      return message.channel.send({ embeds: [errorEmbed] });
    }
  },
};
      