const Discord = require("discord.js");
const path = require("path");
const fs = require("fs");
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const Logger = require('./utils/logger');
const isDev = require('./utils/isDev');
const config = require("./config.json");
const robloxInterface = require('./utils/robloxInterfaces');
const fruitiesInterface = require('./utils/fruitiesInterface');

const adapter = new FileSync(path.join(__dirname, '..', 'suggestions.json'));
const db = lowdb(adapter);

db.defaults({ suggestions: [] }).write();

(async () => {
    const client = new Discord.Client({ disableMentions: 'everyone' });
    
    client.commands = new Discord.Collection();
	client.config = config;
	client.robloxInterface = new robloxInterface(config.groupId);
	client.fruitiesInterface = new fruitiesInterface(config.serviceDomain, config.serviceKey)
	// discordId: { robloxId: number, groupRank: number }
	client.userCache = {}
    client.logger = new Logger(
        isDev() ? 'console' : 'file',
        'logs',
        10,
        'FruitiesBot'
	);
	client.db = db;

    try {
        const roles = await client.robloxInterface.getRoles();
		client.roles = roles;
	} catch (err) {
		client.logger.error('Failed to get group roles: ');
        client.logger.error(err);
        process.exit(1);
    }
    
    fs.readdir('./events/', (err, files) => {
		if (err) return client.logger.error(err);

		let events = files.filter((f) => f.endsWith('.js'));

		if (events === 0) return console.log('No events found');

		events.forEach((file) => {
			let event = require(path.join(__dirname, 'events', file));
			let eventName = file.split('.')[0];
			client.on(eventName, event.bind(null, client));
		});
	});

	fs.readdir('./commands/', (err, files) => {
		if (err) return client.logger.error(err);

		let commands = files.filter((f) => f.endsWith('.js'));

		if (commands === 0) return console.log('No commands found');

		commands.forEach((file) => {
			let command = require(path.join(__dirname, 'commands', file));
			client.commands.set(command.config.name, command);
		});
	});

	client.login(config.token);
})();