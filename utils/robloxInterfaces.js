const request = require('request');

class robloxInterface {
    constructor(groupId) {
        this.groupId = groupId;
    }

    getRoles() {
        return new Promise((resolve, reject) => {
            request(`https://groups.roblox.com/v1/groups/${this.groupId}/roles`, {
                json: true
            }, (err, res, body) => {
                if (err) reject(err);

                if (res.statusCode !== 200) reject(`Status: ${res.statusCode} Response: ${JSON.stringify(body)}`);

                const ranks = body.roles.map(role => ({ name: role.name, id: role.id, rank: role.rank }));
                resolve(ranks)
            });
        });
    }

    getById(userId) {
        return new Promise((resolve, reject) => {
            request({
                url: `https://api.roblox.com/users/${userId}`,
                json: true
            }, (err, res, body) => {
                if(err) reject(err);

                if(res.statusCode !== 200) reject(`Status: ${res.statusCode} Response: ${JSON.stringify(body)}`);

                resolve(body);
            });
        });
    }

    getByUsername(username) {
        return new Promise((resolve, reject) => {
            request({
                url: `https://api.roblox.com/users/get-by-username/`,
                json: true,
                body: {
                    username
                }
            }, (err, res, body) => {
                if(err) reject(err);

                if(res.statusCode !== 200) reject(`Status: ${res.statusCode} Response: ${JSON.stringify(body)}`);

                resolve(body);
            });
        });
    }

    getRankHolders(rankId) {
        return new Promise((resolve, reject) => {
            request({
                url: `https://groups.roblox.com/v1/groups/${this.groupId}/roles/${rankId}/users?cursor=&limit=100`,
                json: true
            }, (err, res, body) => {
                if(err) reject(err);
    
                if(res.statusCode !== 200) reject(`Status: ${res.statusCode} Response: ${JSON.stringify(body)}`);
    
                resolve(body);
            });
        });
    }

    getProfileInfo(robloxId) {
        return new Promise((resolve, reject) => {
            request({
                url: `https://users.roblox.com/v1/users/${robloxId}`,
                json: true,
            }, (err, res, body) => {
                if(err) reject(err);

                if(res.statusCode !== 200) reject(`Status: ${res.statusCode} Response: ${JSON.stringify(body)}`);

                resolve(body);
            });
        });
    }

    getStatus(robloxId) {
        return new Promise((resolve, reject) => {
            request({
                url: `https://users.roblox.com/v1/users/${robloxId}/status`,
                json: true,
            }, (err, res, body) => {
                if(err) reject(err);

                if(res.statusCode !== 200) reject(`Status: ${res.statusCode} Response: ${JSON.stringify(body)}`);

                resolve(body.status);
            });
        });
    }

    getLastOnline(userId) {
        return new Promise((resolve, reject) => {
            request({
                url: `https://api.roblox.com/users/${userId}/onlinestatus/`,
                json: true,
                method: "GET",
                headers: {
                    Cookie: `.ROBLOSECURITY=${this.cookie}`
                },
                body: {
                    userIds: [userId]
                }
            }, (err, res, body) => {
                if(err) reject(err);

                if(res.statusCode !== 200) reject(`Status: ${res.statusCode} Response: ${JSON.stringify(body)}`);

                resolve(new Date(body.LastOnline));
            });
        });
    }

    getRanks() {
        return new Promise((resolve, reject) => {
            request({
                url: `https://groups.roblox.com/v1/groups/${this.groupId}/roles`,
                json: true
            }, (err, res, body) => {
                if(err) reject(err);

                if(res.statusCode !== 200) reject(`Status: ${res.statusCode} Response: ${JSON.stringify(body)}`);

                resolve(body);
            });
        });
    }

    getUserGroupInfo(userId) {
        return new Promise((resolve, reject) => {
            request({
                url: `https://api.roblox.com/users/${userId}/groups`,
                json: true
            }, (err, res, body) => {
                if (err) reject(err);
                
                if (res.statusCode !== 200)
                    reject(`Status: ${res.statusCode} Response: ${JSON.stringify(body)}`);

                if(body.errors) reject(`Status: ${body.errors[0].code} Message: ${body.errors[0].message}`);

                const group = body.map(group => ({ rank: group.Rank, id: group.Id, role: group.Role })).find((group) => this.groupId == group.id);

                if (!group) {
                    resolve({ id: this.groupId, role: 'Guest', rank: 0 })
                } else {
                    resolve(group);
                }
            })
        })
    }
}

module.exports = robloxInterface