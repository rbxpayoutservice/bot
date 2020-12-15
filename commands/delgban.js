const buildEmbed = require('../utils/buildEmbed');

module.exports.run = async (client, message, args) => {
    const banId = args[0];
    if (!banId) return message.channel.send(buildEmbed('Error!', ':x: You must enter a ban ID to delete', null, 'error', message.author));

    try {
        const success = await client.fruitiesInterface.delBan(banId);

        if(success) {
            message.channel.send(buildEmbed('Success!', `:white_check_mark: Ban with ID ${banId} has successfully been deleted`, null, null, message.author));
        } else {
            message.channel.send(buildEmbed('Error!', ':x: Ban ID is invalid', null, 'error', message.author));
        }
    } catch (err) {
        client.logger.error('Failed to delete ban');
        client.logger.error(err);
        message.channel.send(buildEmbed('Error!', ':x: Something unexpected happened, the ban was unable to be deleted', null, 'error', message.author));
    }
};

module.exports.config = {
	name: 'delgban', 
    description: 'Delete a global ban from a user\'s record',
    minimumRank: 15,
    usage: '<banid>'
};
