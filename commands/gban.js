const buildEmbed = require('../utils/buildEmbed');
const getUserOrId = require('../utils/getUserOrId');

module.exports.run = (client, message, args) => {
    const user = args[0];
    let duration = args[1];
    let reason = args.splice(2).join(" ");

    if(!user) return message.channel.send(buildEmbed('Error!', ':x: You must provide the name or user ID of the person to ban', null, 'error', message.author));

    if (!duration) {
        return message.channel.send(buildEmbed('Error!', ':x: You must set the ban to \`perm\` or provide a ban length (in days)', null, 'error', message.author));
    } else if (isNaN(duration) && duration.toLowerCase() !== 'perm') {
        return message.channel.send(buildEmbed('Error!', ':x: You must set the ban to \`perm\` or provide a ban length (in days)', null, 'error', message.author));
    } else if (isNaN(duration)) {
        duration = null
    } else {
        if (duration > 99999) duration = 99999;
    }

    if(!reason) return message.channel.send(buildEmbed('Error!', ':x: You must provide a reason for the ban', null, 'error', message.author));

    getUserOrId(user, client, message)
        .then(async ({ userId, userName }) => {
            try {
                const adminRank = client.userCache[message.author.id].groupRank;
                const victimGroupInfo = await client.robloxInterface.getUserGroupInfo(userId);

                if(victimGroupInfo.rank >= adminRank) return message.channel.send(buildEmbed('Error!', `You cannot ban people who have an equal or higher rank than you!`, null, 'error', message.author));

                await client.fruitiesInterface.ban(userId, client.userCache[message.author.id].robloxId, reason, duration);
            
                message.channel.send(buildEmbed('Success!', `:white_check_mark: Successfully GBanned ${userName} (${userId})`, null, null, message.author));
            } catch (err) {
                client.logger.error('Failed to gban user');
                client.logger.error(err);
                message.channel.send(buildEmbed('Error!', ':x: Failed to GBan user', null, 'error', message.author));
            }
        })
        .catch((err) => {
            if(err) client.logger.error(err);
        });
};

module.exports.config = {
	name: 'gban', 
    description: 'Globally ban a user from all Fruitie\'s games',
    minimumRank: 11,
    usage: '<UserID|Name> <Ban Length (days)|Perm> <Reason>'
};
