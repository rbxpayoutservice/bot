const buildEmbed = require('../utils/buildEmbed');
const getUserOrId = require('../utils/getUserOrId');

module.exports.run = async (client, message, args) => {
    let type = args[0];
    if (!type || !['add', 'remove', 'set', 'get'].includes(type.toLowerCase())) return message.channel.send(buildEmbed('Error!', `:x: Please enter either \`add\`, \`remove\`, \`get\` or \`set\``, null, 'error', message.author))

    type = type.toLowerCase();

    let user = args[1];
    
    getUserOrId(user, client, message)
        .then(async ({ userName, userId }) => {
            const amount = args[2];
            if (type !== 'get') {
                if (!amount) return message.channel.send(buildEmbed('Error!', `:x: Please provide the amount of points to ${type}`, null, 'error', message.author))
                if (isNaN(amount)) return message.channel.send(buildEmbed('Error!', ':x: Points must be a number' + userId, null, 'error', message.author))
            }

            switch(type) {
                case 'add':
                    try {
                        const res = await client.fruitiesInterface.addPoints(userId, amount);

                        message.channel.send(buildEmbed('Success!', `:white_check_mark: Successfully added \`${amount}\` points to ${userName}. They now have \`${res.points}\` points`, null, null, message.author))
                    } catch (err) {
                        message.channel.send(buildEmbed('Error!', `:x: Failed to ${type} points for ` + userId, null, 'error', message.author))
                        client.logger.error(`Failed to ${type} points for ` + userId)
                        client.logger.error(err);
                    }
                    break;
                case 'remove':
                    try {
                        const res = await client.fruitiesInterface.removePoints(userId, amount);

                        message.channel.send(buildEmbed('Success!', `:white_check_mark: Successfully removed \`${amount}\` points from ${userName}. They now have \`${res.points}\` points`, null, null, message.author))
                    } catch (err) {
                        message.channel.send(buildEmbed('Error!', `:x: Failed to ${type} points for ` + userId, null, 'error', message.author))
                        client.logger.error(`Failed to ${type} points for ` + userId)
                        client.logger.error(err);
                    }
                    break;
                case 'set':
                    try {
                        const res = await client.fruitiesInterface.setPoints(userId, amount);

                        message.channel.send(buildEmbed('Success!', `:white_check_mark: Successfully set points of ${userName} to \`${res.points}\``, null, null, message.author))
                    } catch (err) {
                        message.channel.send(buildEmbed('Error!', `:x: Failed to ${type} points for ` + userId, null, 'error', message.author))
                        client.logger.error(`Failed to ${type} points for ` + userId)
                        client.logger.error(err);
                    }
                    break;
                case 'get':
                    try {
                        const res = await client.fruitiesInterface.getPoints(userId, amount);

                        message.channel.send(buildEmbed('Success!', `:white_check_mark: ${userName} has \`${res.points}\` points`, null, null, message.author))
                    } catch (err) {
                        message.channel.send(buildEmbed('Error!', `:x: Failed to ${type} points for ` + userId, null, 'error', message.author))
                        client.logger.error(`Failed to ${type} points for ` + userName)
                        client.logger.error(err);
                    }
            }
        })
        .catch((err) => {
            if(err) client.logger.error(err);
        });
};

module.exports.config = {
	name: 'points',
    aliases: ['wp'],
	description: 'Modify user points',
    minimumRank: 19,
    usage: '<add|remove|set|get> <name|userid> <amount>'
};
