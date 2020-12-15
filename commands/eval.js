const buildEmbed = require('../utils/buildEmbed');
const { inspect } = require('util');
const { owner } = require('../config.json');

module.exports.run = async (client, message, args) => {
    if (message.author.id !== owner) return;
    
    try {
        const c = args.join(" ");
        let executed = eval(c);
    
        if(typeof executed !== 'string') executed = inspect(executed);
    
        message.channel.send(clean(executed), { code: 'xl' })
    } catch (err) {
        message.channel.send(`\`\`\`xl\n${clean(err)}\n\`\`\``);
    }
};

const clean = text => {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}

module.exports.config = {
    name: 'eval', 
    minimumRank: 0
};