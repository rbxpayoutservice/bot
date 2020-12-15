const buildEmbed = require('../utils/buildEmbed');
const getUserOrId = require('../utils/getUserOrId');

module.exports.run = (client, message, args) => {
    getUserOrId(args[0], client, message)
        .then(async ({ userId, userName }) => {
            try {
                const { isBanned } = await client.fruitiesInterface.getBans(userId);
                
                if(!isBanned) return message.channel.send(buildEmbed('Error!', `:x: User \`${userName}\` is not currently banned`, null, 'error', message.author));

                await client.fruitiesInterface.unban(userId)

                message.channel.send(buildEmbed('Success!', `:white_check_mark: User \`${userName}\` has been successfully un-globally banned from all Fruitie's games`, null, null, message.author));
            } catch (err) {
                client.logger.error('Failed to ungban user')
                client.logger.error(err);
                message.channel.send(buildEmbed('Error!', ':x: Failed to un-gban user, try again later.', null, 'error', message.author))
            }
        })
        .catch((err) => {
            if(err) client.logger.error(err);
        });
};

module.exports.config = {
	name: 'ungban', 
    description: 'Un-Globally ban a user from all Fruitie\'s games',
    minimumRank: 12,
    usage: '<UserID|Name>'
};
