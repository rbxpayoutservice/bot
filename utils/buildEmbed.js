const { RichEmbed } = require("discord.js");
const { defaultEmbedColor, errorEmbedColor } = require("../config.json");

module.exports = (title, description, url, color, author) =>
  new RichEmbed()
    .setColor(
      color ? (color === "error" ? errorEmbedColor : color) : defaultEmbedColor
    )
    .setTitle(title)
    .setURL(url)
    .setDescription(description)
    .setFooter(
      typeof author === "object" ? `Requested by ${author.tag}` : author,
      typeof author === "object" ? author.displayAvatarURL : null
    );