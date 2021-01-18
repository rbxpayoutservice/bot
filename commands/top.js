const buildEmbed = require('../utils/buildEmbed');

module.exports.run = async (client, message) => {
	try {
		const pointHolders = await client.fruitiesInterface.getPointLeaders(5);
		const embed = await buildPageEmbed(1, pointHolders);

		message.channel.send(embed).then((msg) => {
			msg.react('⬅️').then(() => {
				msg.react('➡️');

				const backFilter = (reaction, user) =>
					reaction.emoji.name === '⬅️' && user.id === message.author.id;
				const forwardFilter = (reaction, user) =>
					reaction.emoji.name === '➡️' && user.id === message.author.id;

				const back = msg.createReactionCollector(backFilter, { time: 480000 });
				const forward = msg.createReactionCollector(forwardFilter, {
					time: 4800000
				});

				let page = 1;

				back.on('collect', async (r) => {
					r.users.remove(message.author);
					if (page === 1) return;
					page--;

					console.log(page);
					const holders = await client.fruitiesInterface.getPointLeaders(
						5,
						page
					);
					const embed = await buildPageEmbed(page, holders);
					msg.edit(embed);
				});

				forward.on('collect', async (r) => {
					r.users.remove(message.author);
					if (page === pointHolders.totalPages) return;
					page++;

					console.log(page);
					const holders = await client.fruitiesInterface.getPointLeaders(
						5,
						page
					);

					const embed = await buildPageEmbed(page, holders);
					msg.edit(embed);
				});
			});
		});
	} catch (err) {
		message.channel.send(
			buildEmbed(
				'Error!',
				':x: Unable to get point leaders, please try again later',
				null,
				'error',
				message.author
			)
		);
		client.logger.error('Failed to get leaderpoints');
		client.logger.error(err);
	}

	function buildPageEmbed(page, holders) {
		return new Promise(async (resolve, reject) => {
			try {
				const usersToFetch = holders.docs.map((holder) =>
					client.robloxInterface.getById(holder.robloxId)
				);

				Promise.all(usersToFetch)
					.then((res) => {
						let holderText = '';

						res.forEach((user, index) => {
							const holder = holders.docs.find(
								(holder) => holder.robloxId === user.Id
							);
							holderText += `${index + 1}: [${
								user.Username
							}](https://www.roblox.com/users/${user.Id}/profile) - ${
								holder.points
							} Points\n\n`;
						});

						resolve(
							buildEmbed(
								'Workerpoint Leaderboard',
								holderText,
								null,
								null,
								`Page ${page}/${holders.totalPages}`
							)
						);
					})
					.catch((err) => {
						reject(err);
					});
			} catch (err) {
				reject(err);
			}
		});
	}
};

module.exports.config = {
	name: 'topwp',
	aliases: ['top'],
	description: 'Check the 10 people with the highest workerpoints',
	minimumRank: 0
};
