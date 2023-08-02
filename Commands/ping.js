module.exports = {
  name: 'ping',
  description: 'Shows the bot\'s latency (ping) and reply time!',
  run(client,message,args) {
    const startTime = Date.now();
    message.channel.send('Calculating ping...').then(sentMessage => {
      const ping = sentMessage.createdTimestamp - message.createdTimestamp;
      const replyTime = Date.now() - startTime;
      sentMessage.edit(`Pong! Latency: ${ping}ms, Reply Time: ${replyTime}ms`);
    });
  },
};
      