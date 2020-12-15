const buildEmbed = require('../utils/buildEmbed');
const chrono = require('chrono-node');
const { Attachment } = require('discord.js');

module.exports.run = async (client, message, args) => {
	try {
        let week = args[0];
        if(week) {
            week = chrono.parseDate(week);

            if(!week) return message.channel.send(buildEmbed('Error!', "Failed to parse week", null, 'error', message.author));
        } else {
            week = new Date();
        }

        week = Math.floor(((week.getTime() / 1000) - 370800) / 604800);

        message.channel.send(buildEmbed('Success!', "Please allow a few moments for a report to be generated. A text file will be uploaded once complete. This make take a minute to complete if Roblox is being slow.", null, null, message.author));

        const ranks = await client.robloxInterface.getRanks();

        const fetchingRanks = ranks.roles.filter(rank => rank.rank >= client.config.minimumActivityTrackRank && rank.rank <= client.config.maximumActivityTrackRank);

        let usersToFetch = [];

        const rankHolders = await Promise.all(fetchingRanks.map(rank => client.robloxInterface.getRankHolders(rank.id)));

        for (const rank of rankHolders) {
            for (const user of rank.data) {
                usersToFetch.push(user.userId);
            }
        }

        // retarded variable name just like im retarded too
        const activities = await client.fruitiesInterface.getTopActivity(usersToFetch, 'include', week);

        const usernames = await Promise.all(activities.map(user => client.robloxInterface.getById(user.robloxId)));

        let reportMessage = '';

        for (const name of usernames) {
            const activity = activities.find(user => user.robloxId === name.Id);
            reportMessage += `${name.Username} (${name.Id}): ${activity.minutes} minutes of activity\n`;
        }

        const attachment = new Attachment(Buffer.from(reportMessage), `ActivityReport-${week.toLocaleString()}.txt`);
        message.channel.send(attachment);
    } catch (err) {
        message.channel.send(buildEmbed('Error!', ':x: We were unable to generate an activity report', null, 'error', message.author));
        client.logger.error('Failed to generate activity report');
        client.logger.error(err);
    }
};

module.exports.config = {
    name: 'activityreport', 
    usage: '<OPTIONAL: Date>',
    description: 'Generate a report of MR activity in the restaurant for the current week',
    minimumRank: 16
};