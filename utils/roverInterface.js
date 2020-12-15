const request = require('request');

exports.getRobloxByDiscord = (discordId) => {
    return new Promise((resolve, reject) => {
        request(`https://verify.eryn.io/api/user/${discordId}`,
            {
                json: true
            },
        (err, res, body) => {
            if (err) reject(err);

            if(res.statusCode !== 200 && res.statusCode !== 404) reject(`Failed to check verification status. Response: ${JSON.stringify(body)}`)

            resolve(body);
        }); 
    });     
}