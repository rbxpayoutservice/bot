const { RichEmbed } = require('discord.js');

module.exports.run = (client, message, args) => {
	let helpEmbed = new RichEmbed()
		.setTitle('Command List')
		.setColor('#4fe647')
		.setFooter(
			`Requested by ${message.author.tag}`,
			message.author.displayAvatarURL
		);
	client.commands.filter(cmd => cmd.config.description).forEach((command) => {
		helpEmbed.addField(
			`${client.config.prefix}${command.config.name} ${command.config.aliases ? `(aliases: ${client.config.prefix}${command.config.aliases.join(', ')})` : ''} - Minimum Rank: \`${client.roles.find(role => role.rank === command.config.minimumRank).name}\``,
			`${command.config.description} ${command.config.usage ? `\n Usage: \`${client.config.prefix}${command.config.name} ${command.config.usage}\`` : ''}`
		);
	});

	message.channel.send(':white_check_mark: Help has been sent in DM!');
	message.author.send(helpEmbed);
};

module.exports.config = {
	name: 'help', 
	aliases: ['cmds', 'commands'],
    minimumRank: 0
};
