const { Command } = require("klasa");
const subReddits = ["NSFW_GIF", "nsfw_gifs", "porn_gifs", "porninfifteenseconds", "CuteModeSlutMode", "60fpsporn", "NSFW_HTML5"];
const { MessageEmbed } = require("discord.js");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            cooldown: 8,
            aliases: ["nsfwgif"],
            requiredPermissions: ["ATTACH_IMAGES", "EMBED_LINKS"],
            description: msg => msg.language.get("COMMAND_GIFS_DESCRIPTION"),
            extendedHelp: "No extended help available."
        });
    }

    async run(msg) {
        if (!msg.channel.nsfw) return msg.sendMessage(`<:penguError:435712890884849664> ***This channel is not NSFW so I can't send it here...***`);
        if (!await this.client.functions.isUpvoter(msg.author.id)) return msg.sendMessage(`<:penguError:435712890884849664> ***You are not an up-voter of PenguBot, please visit <https://www.pengubot.com/upvote> to vote now and get access!***`);
        try {
            let img = await this.client.functions.scrapeSubreddit(subReddits[Math.floor(Math.random() * subReddits.length)]);
            if (!img) return msg.sendMessage(`Too fast, too furious, try again!`);
            if (img.indexOf(".mp4")) {
                img = await this.client.functions.scrapeSubreddit(subReddits[Math.floor(Math.random() * subReddits.length)]);
            }
            const embed = new MessageEmbed()
                .setFooter("© PenguBot.com")
                .setTimestamp()
                .setImage(img)
                .setColor("RANDOM");
            return msg.sendMessage({ embed: embed });
        } catch (e) {
            return msg.sendMessage(`There was an error, try again!`);
        }
    }

};
