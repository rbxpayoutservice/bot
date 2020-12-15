module.exports.run = (client, message) => {
	message.channel.send('PINGING...').then((m) => {
		m.edit(
			`API Latency: ${
				m.createdTimestamp - message.createdTimestamp
			}ms. Average heartbeat: ${Math.round(client.ping)}ms`
		);
	});
};

module.exports.config = {
	name: 'ping',
	minimumRank: 0,
};
