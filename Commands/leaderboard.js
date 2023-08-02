const { EmbedBuilder } = require('discord.js');
const fs = require('fs/promises');
const path = require('path');

const filePath = path.join(__dirname, '..', 'json', 'Fund.json');

module.exports = {
  name: 'leaderboard',
  description: 'Show the top 10 users in the leaderboard with the highest funds.',
  aliases: ["lb"],
  run: async (client, message) => {
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

    const sortedLeaderboard = Object.entries(fundData)
      .filter(([userId]) => userId !== 'server') 
      .sort((a, b) => b[1].fund - a[1].fund)
      .slice(0, 10);

    const leaderboardDescription = sortedLeaderboard
      .map((entry, index) => `${index + 1}. <@${entry[0]}> - $${entry[1].fund}`)
      .join('\n');

    
    const userIndex = sortedLeaderboard.findIndex(([userId]) => userId === message.author.id);
    let userRank;
    if (userIndex !== -1) {
      userRank = userIndex + 1;
      const rankSuffix = getRankSuffix(userRank);
      userRank = `${userRank}${rankSuffix}`;
    } else {
      userRank = 'Not in top 10';
    }

    const leaderboardEmbed = new EmbedBuilder()
      .setColor('#C016FD')
      .setDescription(`Leaderboard - Top 10 Users with Highest Funds\n\n${leaderboardDescription}`)
      .setFooter({text: `Your Rank: ${userRank}`});

    message.channel.send({ embeds: [leaderboardEmbed] });
  },
};
function getRankSuffix(rank) {
  if (rank >= 10 && rank <= 20) {
    return 'th';
  }
  const lastDigit = rank % 10;
  if (lastDigit === 1) {
    return 'st';
  } else if (lastDigit === 2) {
    return 'nd';
  } else if (lastDigit === 3) {
    return 'rd';
  } else {
    return 'th';
  }
        }
      