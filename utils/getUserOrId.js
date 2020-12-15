const buildEmbed = require('../utils/buildEmbed');

module.exports = (user, client, message) => new Promise(async (resolve, reject) => {
    let userName;
    let userId;

    if(!user) {
        message.channel.send(buildEmbed('Error!', `:x: Please enter the **username** or **ID** of the user`, null, 'error', message.author))
        return reject();
    }
    
    if (!isNaN(user)) {
        const filter = m => m.content.toLowerCase() === 'id' || m.content.toLowerCase() === 'username';
        await message.channel.send('Is the user you entered a **username** or an **ID?**')
        try {
            const collected = await message.channel.awaitMessages(filter, { maxMatches: 1, time: 30000, errors: ['time'] })

            if (collected.first().content === 'username') {
                // get id and assign to use
                try {
                    const res = await client.robloxInterface.getByUsername(user);

                    if(res.success !== undefined && res.success === false) {
                        message.channel.send(`:x: ${res.errorMessage}`);
                        return reject();
                    }

                    userName = res.Username;
                    userId = res.Id;
                } catch (err) {
                    message.channel.send(buildEmbed('Error!', 'Failed to get User ID from username', null, 'error', message.author))
                    client.logger.error('Failed to get userID for ' + user)
                    client.logger.error(err);
                    return reject();
                }
            } else if (collected.first().content === 'id') {
                try {
                    const res = await client.robloxInterface.getById(user);

                    if(res.success !== undefined && res.success === false) {
                        message.channel.send(`:x: ${res.errorMessage}`);
                        return reject();
                    }

                    userId = res.Id;
                    userName = res.Username;
                } catch (err) {
                    message.channel.send(buildEmbed('Error!', 'Failed to get user from User ID', null, 'error', message.author))
                    client.logger.error('Failed to get userID for ' + user)
                    client.logger.error(err);
                    return reject();
                }
            }
        } catch (err) {
            message.channel.send(buildEmbed('Error!', 'Command aborted, you took longer than 30 seconds to respond.', null, 'error', message.author));
            return reject();
        }
    } else {
        try {
            const res = await client.robloxInterface.getByUsername(user);

            if(res.success !== undefined && res.success === false) {
                message.channel.send(`:x: ${res.errorMessage}`);
                return reject();
            }

            userName = res.Username;
            userId = res.Id;
        } catch (err) {
            message.channel.send(buildEmbed('Error!', 'Failed to get User ID from username', null, 'error', message.author))
            client.logger.error('Failed to get userID for ' + user)
            client.logger.error(err);
            return reject();
        }
    }

    resolve({userName, userId});
});