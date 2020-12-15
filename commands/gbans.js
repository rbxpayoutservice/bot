const { MessageEmbed } = require('discord.js');
const { defaultEmbedColor } = require('../config');
const buildEmbed = require('../utils/buildEmbed');
const getUserOrId = require('../utils/getUserOrId');

module.exports.run = (client, message, args) => {
	getUserOrId(args[0], client, message)
		.then(async ({ userId, userName }) => {
			try {
				const response = await client.fruitiesInterface.getBans(userId);

				const bans = response.bans;
				let page = 1;

				const embed = new MessageEmbed()
					.setTitle(`${userName}'s Bans`)
					.setURL(`https://www.roblox.com/users/${userId}/profile`)
					.setThumbnail(
						`https://www.roblox.com/bust-thumbnail/image?userId=${userId}&width=420&height=420&format=png `
					)
					.setColor(defaultEmbedColor);

				if (!bans.length) {
					embed.setDescription(
						`Banned: \`false\`\n\n This user has no moderation history`
					);
					embed.setFooter(
						`Requested by ${message.author.tag}`,
						message.author.displayAvatarURL
					);
					message.channel.send(embed);
				} else {
					const ban = bans[0];

					let details = `
						Banned: \`${response.isBanned}\` 

                        ID: \`${ban.id}\`
                        Reason: \`${ban.reason}\`
                        Banned By: \`${
													(await client.robloxInterface.getById(ban.admin))
														.Username
												} (${ban.admin})\`
                        Banned At: \`${new Date(ban.at).toLocaleString()}\`
                        Duration: \`${
													ban.banType === 'Perm'
														? ban.banType
														: `${Math.ceil(
																(ban.unixEndsAt - ban.unixAt) / 86400
														  )} Days`
												}\`
                    `;

					if (ban.endsAt) {
						details += `Ends At: \`${new Date(ban.endsAt).toLocaleString()}\``;
					}

					embed.setDescription(details);

					embed.setFooter(
						`Ban ${page} of ${bans.length}`,
						message.author.displayAvatarURL
					);

					message.channel.send(embed).then((msg) => {
						msg.react('⬅️').then(() => {
							msg.react('➡️');

							const backFilter = (reaction, user) =>
								reaction.emoji.name === '⬅️' && user.id === message.author.id;
							const forwardFilter = (reaction, user) =>
								reaction.emoji.name === '➡️' && user.id === message.author.id;

							const back = msg.createReactionCollector(backFilter, {
								time: 120000
							});
							const forward = msg.createReactionCollector(forwardFilter, {
								time: 120000
							});

							back.on('collect', async (r) => {
								r.remove(message.author);
								if (page === 1) return;
								page--;

								const ban = bans[page - 1];

								let details = `
                                            Banned: \`${response.isBanned}\` 


                                            ID: \`${ban.id}\`
                                            Reason: \`${ban.reason}\`
                                            Banned By: \`${
																							(
																								await client.robloxInterface.getById(
																									ban.admin
																								)
																							).Username
																						} (${ban.admin})\`
                                            Banned At: \`${new Date(
																							ban.at
																						).toLocaleString()}\`
                                            Duration: \`${
																							ban.banType === 'Perm'
																								? ban.banType
																								: Math.ceil(
																										(ban.unixEndsAt -
																											ban.unixAt) /
																											86400
																								  )
																						} Days\`
                                        `;

								if (ban.endsAt) {
									details += `Ends At: \`${new Date(
										ban.endsAt
									).toLocaleString()}\``;
								}

								embed.setDescription(details);
								embed.setFooter(
									`Ban ${page} of ${bans.length}`,
									message.author.displayAvatarURL
								);
								msg.edit(embed);
							});

							forward.on('collect', async (r) => {
								r.remove(message.author);
								if (page === bans.length) return;
								page++;

								const ban = bans[page - 1];

								let details = `
                                            Banned: \`${response.isBanned}\` 


                                            ID: \`${ban.id}\`
                                            Reason: \`${ban.reason}\`
                                            Banned By: \`${
																							(
																								await client.robloxInterface.getById(
																									ban.admin
																								)
																							).Username
																						} (${ban.admin})\`
                                            Banned At: \`${new Date(
																							ban.at
																						).toLocaleString()}\`
                                            Duration: \`${
																							ban.banType === 'Perm'
																								? ban.banType
																								: Math.ceil(
																										(ban.unixEndsAt -
																											ban.unixAt) /
																											86400
																								  )
																						} Days\`
                                        `;

								if (ban.endsAt) {
									details += `Ends At: \`${new Date(
										ban.endsAt
									).toLocaleString()}\``;
								}

								embed.setDescription(details);
								embed.setFooter(
									`Ban ${page} of ${bans.length}`,
									message.author.displayAvatarURL
								);
								msg.edit(embed);
							});
						});
					});
				}
			} catch (err) {
				client.logger.error('Failed to get gbans');
				client.logger.error(err);
				message.channel.send(
					buildEmbed(
						'Error!',
						':x: Failed to get GBans for user',
						null,
						'error',
						message.author
					)
				);
			}
		})
		.catch((err) => {
			if (err) client.logger.error(err);
		});
};

module.exports.config = {
	name: 'gbans',
	description: 'Check the GBans of a user',
	minimumRank: 11,
	usage: '<UserID|Name>'
};
