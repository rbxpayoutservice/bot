const buildEmbed = require('../utils/buildEmbed');

module.exports.run = (client, message, args) => {
    const game = args.join(' ');
    if(!game || !['ic', 'juice bar'].includes(game.toLowerCase())) return message.channel.send(buildEmbed('Error!', ':x: You must provide a game type of either `IC` or `Juice Bar`', null, 'error', message.author));

    try {   
        client.fruitiesInterface.shutdown(game.toLowerCase());
        message.channel.send(buildEmbed('Success!', 'Successfully soft shutdown the game', null, null, message.author));
    } catch (err) {
        message.channel.send(buildEmbed('Error!', ':x: Failed to soft shutdown game', null, 'error', message.author));
        client.logger.error('Failed to shutdown game');
        client.logger.error(err);
    }
};

module.exports.config = {
    name: 'shutdown', 
    aliases: ['softshutdown'],
    description: 'Soft shutdown all servers of a specific game',
    minimumRank: 14,
    usage: '<IC | Juice Bar>'
};
