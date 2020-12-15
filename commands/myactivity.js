const buildEmbed = require('../utils/buildEmbed');

module.exports.run = async (client, message, args) => {
	try {
        const robloxId = client.userCache[message.author.id].robloxId;
        const current = await client.fruitiesInterface.getActivity(robloxId);
        const allTime = await client.fruitiesInterface.getActivity(robloxId, 'all');

        message.channel.send(buildEmbed('Success!', `You have been in-game for \`${current.minutes}\` minutes this week\nYour all-time activity in-game is \`${allTime.minutes}\` minutes`, null, null, message.author));
    } catch (err) {
        message.channel.send(buildEmbed('Error!', ':x: We were unable to fetch your activity', null, 'error', message.author));
        client.logger.error('Failed to fetch activity');
        client.logger.error(err);
    }
};

module.exports.config = {
    name: 'myactivity', 
    aliases: ['activity'],
    description: 'Check your game activity for the week',
    minimumRank: 9
};
