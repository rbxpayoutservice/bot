const buildEmbed = require('../utils/buildEmbed');

module.exports.run = async (client, message, args) => {
	try {
        const robloxId = client.userCache[message.author.id].robloxId;
        const res = await client.fruitiesInterface.getPoints(robloxId);

        message.channel.send(buildEmbed('Success!', `:white_check_mark: You have \`${res.points}\` points`, null, null, message.author));
    } catch (err) {
        message.channel.send(buildEmbed('Error!', ':x: We were unable to check your points', null, 'error', message.author));
        client.logger.error('Failed to get user points');
        client.logger.error(err);
    }
};

module.exports.config = {
    name: 'mypoints',
    description: 'Check your user points',
    minimumRank: 4
};
