const request = require('request');

module.exports = (discordId) =>
	new Promise((resolve, reject) => {
		request({
            url: `https://api.blox.link/v1/user/${discordId}`,
			json: true
		}, (err, res, body) => {
            if (err) reject(err);

            if(res.statusCode !== 200) reject(`Failed to check verification status. Response: ${JSON.stringify(body)}`)

            resolve(body);
        });
	});
