const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Sends a greeting message.',
  aliases: ["hh"],
  run: async (client, message, args) => {
    const embed = new EmbedBuilder()
      .setColor('C016FD')
      .setTitle('**Paylance | Business <:shape:1134728021128003604>**')
      .setDescription(`<:left_arrow:1124982416189177866> **List of Commands:**\n

<:one:1124224852279181342> **!balance**\n\u200B
<:arrow:1123584690486513704> enables seller to check there balance anytime.\n

<:two:1124224889432326184> **!lb**\n\u200B
<:arrow:1123584690486513704>allows seller to check every sellers fund any time.\n


<:info:1124955310092726383> **Admin Commands**\n

<:three:1124224923343257671> **!pay**\n\u200B
<:arrow:1123584690486513704>allows to fund a seller's wallet after a deal/order has been made.\n

<:four:1124224950820155392> **!remove**\n\u200B
<:arrow:1123584690486513704> enables to remove funds from seller's balance once payout is done\n

<:five:1124224995497877617>  **!bank**\n\u200B
<:arrow:1123584690486513704> enables to check server's fund\n

<:six:1129360520143704164> **!bw**\n
<:arrow:1123584690486513704> enables to withdraw funds from server's fund\n

<:seven:1129926843034771667> **!payceo**\n\u200B
<:arrow:1123584690486513704> enables to pay 35% of server fund to the CEO\n

<:eight:1129927238826078290> **!restart**\n\u200B
<:arrow:1123584690486513704> restarts the bot\n`);
      
    await message.channel.send({ embeds: [embed] });
  },
};
