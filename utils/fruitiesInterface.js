const request = require('request');

class FruitiesInterface {
    constructor(serviceDomain, serviceKey) {
        this.serviceDomain = serviceDomain;
        this.serviceKey = serviceKey;
    }

    get headers() {
        return {
            "X-Auth-Key": this.serviceKey
        }
    }

    getActivity(userId, weekId) {
        let query = '';

        if(weekId) query += `?weekId=${weekId}`

        return new Promise((resolve, reject) => {
            request({
                url: `${this.serviceDomain}/activity/${userId}${query}`,
                headers: this.headers,
                json: true
            }, (err, res, body) => {
                if(err) reject(err);

                if (res.statusCode !== 200 && res.statusCode !== 204) reject(`Status: ${res.statusCode} Response: ${JSON.stringify(body)}`);

                resolve(body);
            });
        });
    }

    shutdown(game) {
        return new Promise((resolve, reject) => {
            request({
                url: `${this.serviceDomain}/remote/shutdown`,
                method: 'POST',
                headers: this.headers,
                body: {
                    game
                },
                json: true
            }, (err, res, body) => {
                if (err) reject(err);

                if (res.statusCode !== 200 && res.statusCode !== 204) reject(`Status: ${res.statusCode} Response: ${JSON.stringify(body)}`);

                resolve();
            });
        }); 
    }

    linkDiscord(discordId, robloxId) {
        return new Promise((resolve, reject) => {
            request({
                url: `${this.serviceDomain}/nitro/link`,
                method: 'POST',
                headers: this.headers,
                body: {
                    discordId,
                    robloxId
                },
                json: true
            }, (err, res, body) => {
                if (err) reject(err);

                if (res.statusCode !== 200 && res.statusCode !== 204) reject(`Status: ${res.statusCode} Response: ${JSON.stringify(body)}`);

                resolve(body);
            });
        }); 
    }

    getTopActivity(users, type, weekId) {
        let query = `?type=${type}${users.map(user => `&users=${user}`).join('')}`;
        if(weekId) query += `&weekId=${weekId}`

        return new Promise((resolve, reject) => {
            request({
                url: `${this.serviceDomain}/activity/top${query}`,
                headers: this.headers,
                json: true
            }, (err, res, body) => {
                if (err) reject(err);

                if (res.statusCode !== 200 && res.statusCode !== 204) reject(`Status: ${res.statusCode} Response: ${JSON.stringify(body)}`);

                resolve(body);
            })
        });
    }

    getBans(userId) {
        return new Promise((resolve, reject) => {
            request({
                url: `${this.serviceDomain}/bans/${userId}`,
                headers: this.headers,
                json: true
            }, (err, res, body) => {
                if (err) reject(err);

                if (res.statusCode !== 200 && res.statusCode !== 204) reject(`Status: ${res.statusCode} Response: ${JSON.stringify(body)}`);

                resolve(body);
            });
        }); 
    }

    unban(userId) {
        return new Promise((resolve, reject) => {
            request({
                url: `${this.serviceDomain}/bans/${userId}/unban`,
                headers: this.headers,
                method: 'POST',
                json: true
            }, (err, res, body) => {
                if (err) reject(err);

                if (res.statusCode !== 200 && res.statusCode !== 204) reject(`Status: ${res.statusCode} Response: ${JSON.stringify(body)}`);

                resolve();
            });
        });
    }

    ban(victim, admin, reason, duration) {
        return new Promise((resolve, reject) => {
            const banInfo = {
                type: duration ? 'Temp' : 'Perm',
                reason,
                admin,
                duration: null,
                remote: true
            }

            if (duration) banInfo.duration = duration;

            request({
                url: `${this.serviceDomain}/bans/${victim}/ban`,
                headers: this.headers,
                method: 'POST',
                body: banInfo,
                json: true
            }, (err, res, body) => {
                if (err) reject(err);

                if (res.statusCode !== 200 && res.statusCode !== 204) reject(`Status: ${res.statusCode} Response: ${JSON.stringify(body)}`);

                resolve();
            });
        });
    }

    delBan(banId) {
        return new Promise((resolve, reject) => {
            request({
                url: `${this.serviceDomain}/bans/${banId}`,
                headers: this.headers,
                method: 'DELETE',
                json: true
            }, (err, res, body) => {
                if(err) reject(err);

                if(res.statusCode === 204 || res.statusCode === 200) resolve(true);

                resolve(false);
            });
        });
    }

    getPoints(userId) {
        return new Promise((resolve, reject) => {
            request({
                url: `${this.serviceDomain}/points/${userId}`,
                headers: this.headers,
                json: true
            }, (err, res, body) => {
                if (err) reject(err);

                if (res.statusCode !== 200 && res.statusCode !== 204) reject(`Status: ${res.statusCode} Response: ${JSON.stringify(body)}`);

                resolve(body);
            });
        });
    }

    addPoints(userId, amount) {
        return new Promise((resolve, reject) => {
            request({
                url: `${this.serviceDomain}/points/${userId}/add`,
                method: 'POST',
                headers: this.headers,
                json: true,
                body: {
                    amount
                }
            }, (err, res, body) => {
                if (err) reject(err);

                if (res.statusCode !== 200 && res.statusCode !== 204) reject(`Status: ${res.statusCode} Response: ${JSON.stringify(body)}`);

                resolve(body);
            });
        });
    }

    removePoints(userId, amount) {
        return new Promise((resolve, reject) => {
            request({
                url: `${this.serviceDomain}/points/${userId}/remove`,
                method: 'POST',
                headers: this.headers,
                json: true,
                body: {
                    amount
                }
            }, (err, res, body) => {
                if (err) reject(err);

                if (res.statusCode !== 200 && res.statusCode !== 204) reject(`Status: ${res.statusCode} Response: ${JSON.stringify(body)}`);

                resolve(body);
            });
        });
    }

    setPoints(userId, amount) {
        return new Promise((resolve, reject) => {
            request({
                url: `${this.serviceDomain}/points/${userId}/set`,
                method: 'POST',
                headers: this.headers,
                json: true,
                body: {
                    amount
                }
            }, (err, res, body) => {
                if (err) reject(err);

                if (res.statusCode !== 200 && res.statusCode !== 204) reject(`Status: ${res.statusCode} Response: ${JSON.stringify(body)}`);

                resolve(body);
            });
        });
    }

    getPointLeaders(amount, skip) {
        return new Promise((resolve, reject) => {
            request({
                url: `${this.serviceDomain}/points/top?limit=${amount}&skip=${skip}`,
                headers: this.headers,
                json: true
            }, (err, res, body) => {
                if(err) reject(err);

                if(res.statusCode !== 200) reject(`Status: ${res.statusCode} Response: ${JSON.stringify(body)}`);

                resolve(body);
            });
        })
    }
}

module.exports = FruitiesInterface;