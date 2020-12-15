const { MessageEmbed } = require('discord.js');
const randomstring = require('randomstring');
const buildEmbed = require('../utils/buildEmbed');

module.exports.run = async (client, message, args) => {
	try {
		const suggestionChannel = client.channels.get(
			client.config.suggestionsChannel
		);

		const suggestion = args.join(' ');
		if (!suggestion)
			return message.channel.send(
				buildEmbed(
					'Error!',
					'You need to enter a suggestion',
					null,
					'error',
					message.author
				)
			);

		const suggestionID = randomstring.generate({
			length: 10,
			capitalization: 'uppercase'
		});

		const suggestionEmbed = new MessageEmbed();
		suggestionEmbed.setAuthor(
			`New suggestion from ${message.author.tag}`,
			message.author.displayAvatarURL
		);
		suggestionEmbed.setColor(client.config.defaultEmbedColor);
		suggestionEmbed.addField('Suggestion', suggestion);
		suggestionEmbed.setFooter(
			`User ID: ${message.author.id} - SID: ${suggestionID}`
		);
		suggestionEmbed.setTimestamp(new Date());

		const suggestionMessage = await suggestionChannel.send(suggestionEmbed);
		await suggestionMessage.react('✅');
		await suggestionMessage.react('❌');

		client.db
			.get('suggestions')
			.push({ suggestionID, messageID: suggestionMessage.id })
			.write();

		message.channel.send(
			buildEmbed(
				'Success!',
				'Suggestion has been added!',
				null,
				null,
				message.author
			)
		);
	} catch (err) {
		client.logger.error(err);
		message.channel.send(
			buildEmbed(
				'Error!',
				'Failed to add suggestion',
				null,
				null,
				message.author
			)
		);
	}
};

module.exports.config = {
	name: 'suggestion',
	aliases: ['suggest'],
	description: 'Create a new suggestion',
	minimumRank: 0
};
