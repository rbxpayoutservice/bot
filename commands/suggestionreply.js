const buildEmbed = require('../utils/buildEmbed');
const { RichEmbed } = require('discord.js');

module.exports.run = async (client, message, args) => {
    try {
        const suggestionID = args[0];
        if(!suggestionID) return message.channel.send(buildEmbed('Error!', 'You need to enter the suggestion ID of the suggestion you are replying to', null, 'error', message.author));
        
        const suggestion = client.db.get('suggestions').find({ suggestionID }).value();
        if (suggestion === undefined) return message.channel.send(buildEmbed('Error!', `Suggestion with the ID of \`${suggestionID}\` was not found`, null, 'error', message.author));
        
        const suggestionChannel = client.channels.get(client.config.suggestionsChannel);
        
        let suggestionMessage
        try {
            suggestionMessage = await suggestionChannel.fetchMessage(suggestion.messageID);
        } catch (err) {
            client.logger.error(err);
            message.channel.send(buildEmbed('Error!', 'Original suggestion message has been deleted, so it cannot be responded to', null, 'error', message.author));
            return;
        }

        const response = args.slice(1).join(' ');
        if(!response) return message.channel.send(buildEmbed('Error!', 'You need to enter a response to the suggestion', null, 'error', message.author));

        const originalSuggestionEmbed = suggestionMessage.embeds[0];

        const suggestionResponseEmbed = new RichEmbed();

        suggestionResponseEmbed.setAuthor(originalSuggestionEmbed.author.name, originalSuggestionEmbed.author.iconURL);
        suggestionResponseEmbed.setFooter(originalSuggestionEmbed.footer.text);
        suggestionResponseEmbed.addField(originalSuggestionEmbed.fields[0].name, originalSuggestionEmbed.fields[0].value);
        suggestionResponseEmbed.setColor(originalSuggestionEmbed.color);
        suggestionResponseEmbed.addField(`Developer Response (${message.author.tag})`, response);

        suggestionMessage.edit(suggestionResponseEmbed);
        message.channel.send(buildEmbed('Success!', 'Response added!', null, null, message.author))
    } catch (err) {
        console.error(err);
        client.logger.error(err);
        message.channel.send(buildEmbed('Error!', 'Failed to reply to suggestion', null, null, message.author));
    }
};

module.exports.config = {
    name: 'suggestionreply',
    aliases: ['sr', 'reply'],
    description: 'Reply to a suggestion',
	minimumRank: 14,
};
