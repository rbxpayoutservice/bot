const getRobloxByDiscord = require('../utils/bloxlinkInterface');
const { MessageEmbed } = require('discord.js');

/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 */
module.exports = async (client, message) => {
	if (message.author.bot) return;
	if (message.channel.type === 'dm') return;
	if (
		process.env.NODE_ENV === 'Development' &&
		message.channel.id !== client.config.testingServer
	)
		return;
	if (!message.content.toLowerCase().startsWith(client.config.prefix)) return;

	let args = message.content.split(/\s+/g);
	let command = args.shift().toLowerCase().slice(client.config.prefix.length);

	client.logger.debug(
		`${message.author.id}(${message.author.tag}): ${message.content}`
	);

	let commandFile = client.commands.get(command);
	if (!commandFile) {
		const alias = client.commands.find(
			(cmd) => cmd.config.aliases && cmd.config.aliases.includes(command)
		);
		if (alias) commandFile = alias;
	}

	if (commandFile) {
		if (commandFile.config.minimumRank > 0) {
			const userInfo = client.userCache[message.author.id];
			if (!userInfo) {
				try {
					const response = await getRobloxByDiscord(message.author.id);

					if (response.error) {
						const embed = new MessageEmbed()
							.setTitle('Please click here to verify your account')
							.setDescription(
								`It looks like you are not verified! In order to execute this command, please verify your account by running \`fr!verify\` to confirm your rank is at least \`${
									client.roles.find(
										(role) => role.rank === commandFile.config.minimumRank
									).name
								}\``
							)
							.setURL('https://verify.eryn.io')
							.setColor('RANDOM')
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

							client.userCache[message.author.id] = {
								robloxId: response.primaryAccount,
								groupRank: groupInfo.rank
							};
						} catch (err) {
							message.channel.send(
								':x: Something unexpected happened and we were unable to verify your rank in the group'
							);
							client.logger.warn(
								`Failed to verify ${message.author.id}, couldn't get group info`
							);
							client.logger.warn(groupInfo);
							return;
						}
					}

					if (
						client.userCache[message.author.id].groupRank >=
						commandFile.config.minimumRank
					) {
						commandFile.run(client, message, args);
					} else {
						message.channel.send(
							`:x: You need to be at least rank \`${
								client.roles.find(
									(role) => role.rank === commandFile.config.minimumRank
								).name
							}\` to execute this command.`
						);
					}
				} catch (err) {
					message.channel.send(':x: Failed to check your verification status');
					client.logger.error(
						'Failed to check verification status for ' + message.author.id
					);
					console.log(err);
					client.logger.error(err);
				}
			} else {
				if (userInfo.groupRank >= commandFile.config.minimumRank) {
					commandFile.run(client, message, args);
				} else {
					message.channel.send(
						`:x: You need to be at least rank \`${
							client.roles.find(
								(role) => role.rank === commandFile.config.minimumRank
							).name
						}\` to execute this command.`
					);
				}
			}
		} else {
			commandFile.run(client, message, args);
		}
	}
};
