const randomWords = require('random-words');
const buildEmbed = require('../utils/buildEmbed');
const getUserOrId = require('../utils/getUserOrId');

module.exports.run = async (client, message, args) => {
	try {
		getUserOrId(args[0], client, message)
			.then(async ({ userName, userId }) => {
				const filter = (m) => m.author.id === message.author.id;
				const words = randomWords(7).join(' ');

				message.channel.send(
					buildEmbed(
						'Success!',
						`Please enter the following words into either your Roblox status or description:\n \`\`${words}\`\`\n\nType \`done\` when complete, or \`cancel\` to cancel`,
						null,
						null,
						'This prompt will expire in 2 minutes'
					)
				);

				const collector = await message.channel.createMessageCollector(filter, {
					max: 1,
					time: 15000
				});

				collector.on('collect', async (m) => {
					if (m.content === 'done') {
						let code;

						try {
							const status = await client.robloxInterface.getStatus(userId);

							if (status.includes(words)) {
								code = status;
							} else {
								const userInfo = await client.robloxInterface.getProfileInfo(
									userId
								);

								if (userInfo.description.includes(words))
									code = userInfo.description;
							}

							if (!code)
								return message.channel.send(
									buildEmbed(
										'Error!',
										':x: We were unable to find the code on your Roblox profile',
										null,
										'error',
										message.author
									)
								);
						} catch (err) {
							message.channel.send(
								buildEmbed(
									'Error!',
									':x: We were unable to check your profile for the verification code',
									null,
									'error',
									message.author
								)
							);
							client.logger.error('Failed to check for verification code');
							client.logger.error(err);
						}

						await client.fruitiesInterface.linkDiscord(
							message.author.id,
							userId
						);
						message.channel.send(
							buildEmbed(
								'Finished!',
								`Successfully linked Roblox user ${userName} to the Discord account ${message.author.tag}`,
								null,
								null,
								message.author
							)
						);
					} else if (m.content === 'cancel') {
						message.channel.send(
							buildEmbed(
								'Finished!',
								'Verification request cancelled',
								null,
								'error',
								message.author
							)
						);
					} else {
						message.channel.send(
							buildEmbed(
								'Cancelled!',
								'Invalid response received',
								null,
								'error',
								message.author
							)
						);
					}
				});

				collector.on('end', (collected) => {
					if (!collected.size)
						message.channel.send(
							buildEmbed(
								'Cancelled!',
								'No response received within 2 minutes',
								null,
								'fcbe03',
								message.author
							)
						);
				});
			})
			.catch((err) => {
				if (err) {
					message.channel.send(
						buildEmbed(
							'Error!',
							':x: We were unable to link your discord account to your roblox account',
							null,
							'error',
							message.author
						)
					);
					client.logger.error(err);
				}
			});
	} catch (err) {
		message.channel.send(
			buildEmbed(
				'Error!',
				':x: We were unable to link your discord account to your roblox account',
				null,
				'error',
				message.author
			)
		);
		client.logger.error('Failed to link');
		client.logger.error(err);
	}
};

module.exports.config = {
	name: 'nitrolink',
	description:
		'Link your Discord to your Roblox account to show your special Nitro Boost name tag',
	minimumRank: 0
};
