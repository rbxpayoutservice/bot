const { MessageEmbed } = require('discord.js');
const getUserOrId = require('../utils/getUserOrId');
const buildEmbed = require('../utils/buildEmbed');
const { defaultEmbedColor } = require('../config.json');

module.exports.run = (client, message, args) => {
	getUserOrId(args[0], client, message)
		.then(async ({ userName, userId }) => {
			try {
				const groupRank = await client.robloxInterface.getUserGroupInfo(userId);
				const userInfo = await client.robloxInterface.getProfileInfo(userId);
				const lastOnline = await client.robloxInterface.getLastOnline(userId);

				const embed = new MessageEmbed();
				embed.setTitle(userName);
				embed.setDescription(userInfo.description);
				embed.setColor(defaultEmbedColor);
				embed.setURL(`https://www.roblox.com/users/${userId}/profile`);
				embed.addField('Rank in Group:', groupRank.role);
				embed.addField(
					'Is Banned: (From Roblox)',
					String(userInfo.isBanned).charAt(0).toUpperCase() +
						String(userInfo.isBanned).slice(1)
				);
				embed.addField('User ID:', userId);
				embed.addField('Created:', new Date(userInfo.created).toLocaleString());
				embed.addField('Last Online:', lastOnline.toLocaleString());

				message.channel.send(embed);
			} catch (err) {
				message.channel.send(
					buildEmbed(
						'Error!',
						':x: Failed to get info on user',
						null,
						'error',
						message.author
					)
				);
				client.logger.error(err);
			}
		})
		.catch((err) => {
			if (err) client.logger.error(err);
		});
};

module.exports.config = {
	name: 'info',
	description: 'Get info on a Roblox user',
	usage: '<User ID or Username>',
	minimumRank: 0
};
