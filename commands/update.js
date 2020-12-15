const buildEmbed = require('../utils/buildEmbed');
const getRobloxByDiscord = require('../utils/bloxlinkInterface');

module.exports.run = async (client, message) => {
    const userToUpdate = message.mentions.users.first() || message.author;

    let userInfo
    if(client.userCache[userToUpdate.id]) {
        userInfo = client.userCache[userToUpdate.id]
    } else {        
        try {
            const res = await getRobloxByDiscord(userToUpdate.id);

            if (res.error) {
                return message.channel.send(buildEmbed('Error!', ':x: This user has not verified themselves yet!', null, 'error', message.author))
            }

            userInfo = {
                robloxId: res.primaryAccount,
                groupRank: 0
            };
        } catch (err) {
            client.logger.error('Failed to get roblox info');
            client.logger.error(err);
            message.channel.send(buildEmbed('Error!', ':x: Verification status unable to be confirmed', null, 'error', message.author))
            return;
        }
    }

    let oldUserInfo = {}
    Object.assign(oldUserInfo, userInfo);

    try {
        const groupInfo = await client.robloxInterface.getUserGroupInfo(userInfo.robloxId);

        if (groupInfo.rank === oldUserInfo.groupRank) {
            message.channel.send(buildEmbed('Error!', ':x: No changes were made, so no ranks were updated.', null, 'error', message.author))
            return;
        }

        userInfo.groupRank = groupInfo.rank;

        client.userCache[userToUpdate.id] = userInfo;

        message.channel.send(buildEmbed('Success!', `:white_check_mark: Successfully updated rank of ${userToUpdate.username} to \`${groupInfo.role}\``, null, null, message.author))
    } catch (err) {
        client.logger.error('Failed to get user group info');
        client.logger.error(err);
        message.channel.send(buildEmbed('Error!', ':x: Unable to check user\'s rank in the group', null, 'error', message.author))
        return;
    }
};

module.exports.config = {
	name: 'update',
	description: 'Update your group rank',
    minimumRank: 1,
    usage: '<@user|empty>'
};
