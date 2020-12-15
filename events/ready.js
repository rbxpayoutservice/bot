module.exports = async (client) => {
    client.logger.info("Logged in: " + client.user.tag);
    client.user.setActivity('fr!help')
}