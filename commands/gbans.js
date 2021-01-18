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

				const embed = buildEmbed(
					`${userName}'s Bans`,
					'',
					`https://www.roblox.com/users/${userId}/profile`,
					null,
					message
				);
				embed.setThumbnail(
					`https://www.roblox.com/bust-thumbnail/image?userId=${userId}&width=420&height=420&format=png`
				);

				if (!bans.length) {
					embed.setDescription(
						`Banned: \`false\`\n\nThis user has no moderation history`
					);
					message.channel.send(embed);
				} else {
					const ban = bans[0];

					embed.setDescription(await buildPageEmbed(ban, response.isBanned));
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
								r.users.remove(message.author);
								if (page === 1) return;
								page--;

								const ban = bans[page - 1];

								embed.setDescription(
									await buildPageEmbed(ban, response.isBanned)
								);
								embed.setFooter(
									`Ban ${page} of ${bans.length}`,
									message.author.displayAvatarURL
								);

								msg.edit(embed);
							});

							forward.on('collect', async (r) => {
								r.users.remove(message.author);
								if (page === bans.length) return;
								page++;

								const ban = bans[page - 1];

								embed.setDescription(
									await buildPageEmbed(ban, response.isBanned)
								);
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

	async function buildPageEmbed(ban, isBanned) {
		let details = `
				Banned: \`${isBanned}\` 


				ID: \`${ban.id}\`
				Reason: \`${ban.reason}\`
				Banned By: \`${(await client.robloxInterface.getById(ban.admin)).Username} (${
			ban.admin
		})\`
				Banned At: \`${new Date(ban.at).toLocaleString()}\`
				Duration: \`${
					ban.banType === 'Perm'
						? ban.banType
						: `${Math.ceil((ban.unixEndsAt - ban.unixAt) / 86400)} Days`
				}\`
			`;

		if (ban.endsAt) {
			details += `Ends At: \`${new Date(ban.endsAt).toLocaleString()}\``;
		}

		return details;
	}
};

module.exports.config = {
	name: 'gbans',
	description: 'Check the GBans of a user',
	minimumRank: 11,
	usage: '<UserID|Name>'
};
