const { MessageEmbed } = require('discord.js');
const buildEmbed = require('../utils/buildEmbed');
const getRobloxByDiscord = require('../utils/bloxlinkInterface');

module.exports.run = async (client, message) => {
	try {
		const response = await getRobloxByDiscord(message.author.id);

		if (response.error) {
			const embed = new MessageEmbed()
				.setTitle('Please click here to verify your account')
				.setDescription('Once you verify, you are good to go!')
				.setURL('https://blox.link/verify/')
				.setColor('#4fe647')
				.setFooter(
					`Requested by ${message.author.tag}`,
					message.author.displayAvatarURL
				);

			return message.channel.send(embed);
		}

		if (response.status === 'ok' && response.primaryAccount) {
			let groupInfo;

			try {
				groupInfo = await client.robloxInterface.getUserGroupInfo(
					response.primaryAccount
				);
			} catch (err) {
				if (!user)
					return message.channel.send(
						buildEmbed(
							'Error!',
							':x: Something unexpected happened and we were unable to verify your rank in the group. Please try again.',
							null,
							'error',
							message.author
						)
					);
				client.logger.warn(
					`Failed to verify ${message.author.id}, couldn't get group info`
				);
				client.logger.warn(groupInfo);
				return;
			}

			client.userCache[message.author.id] = {
				robloxId: response.primaryAccount,
				groupRank: groupInfo.rank
			};

			message.channel.send(
				buildEmbed(
					'Success!',
					`:white_check_mark: You are already verified!`,
					null,
					null,
					message.author
				)
			);

			return;
		}

		message.channel.send(
			buildEmbed(
				'Error!',
				':x: Something unexpected happened and we were unable to verify',
				null,
				'error',
				message.author
			)
		);
		client.logger.warn(`Failed to verify ${message.author.id}`);
		client.logger.warn(response);
	} catch (err) {
		message.channel.send(
			buildEmbed(
				'Error!',
				':x: Something unexpected happened and we were unable to verify',
				null,
				'error',
				message.author
			)
		);
		client.logger.error(`Failed to verify ${message.author.id}`);
		client.logger.error(err);
	}
};

module.exports.config = {
	name: 'verify',
	description: 'Verify your ROBLOX account',
	minimumRank: 0
};
