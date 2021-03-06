const { Event } = require("klasa");
const { MessageEmbed } = require("discord.js");

module.exports = class extends Event {

    constructor(...args) {
        super(...args);
        this.provider = this.client.providers.default;
    }

    async run(reaction) {
        const msg = reaction.message;
        const { guild } = msg;
        if (!guild) return;
        if (!guild.configs.starboard.enabled || !guild.configs.starboard.channel) return;
        if (reaction.emoji.name !== "⭐") return;

        const starChannel = msg.guild.channels.find(c => c.id === msg.guild.configs.starboard.channel);
        if (!starChannel || !starChannel.postable) return;
        if (!starChannel.nsfw && msg.channel.nsfw) return;
        const fetch = await starChannel.messages.fetch({ limit: 100 });
        const starMsg = fetch.find(m => m.embeds[0] && m.embeds[0].footer.text.startsWith("⭐") && m.embeds[0].footer.text.endsWith(msg.id));

        if (starMsg) {
            const starEmbed = starMsg.embeds[0];
            const image = msg.attachments.size > 0 ? await this.checkAttachments(msg.attachments.array()[0].url) : null;
            const embed = new MessageEmbed()
                .setColor(starEmbed.color)
                .setAuthor(`${msg.author.tag} in #${msg.channel.name}`, msg.author.displayAvatarURL())
                .setTimestamp()
                .setFooter(`⭐ ${msg.reactions.get("⭐").count} | ${msg.id}`);
            if (image) embed.setImage(image);
            if (starEmbed.description) embed.setDescription(starEmbed.description);
            const oldMsg = await starChannel.messages.fetch(starMsg.id);
            if (oldMsg.author.id !== this.client.user.id) return;
            if (!msg.reactions.get("⭐")) return oldMsg.delete();
            await oldMsg.edit({ embed });
        }
    }

    checkAttachments(attachment) {
        const imageLink = attachment.split(".");
        const typeOfImage = imageLink[imageLink.length - 1];
        const image = /(jpg|jpeg|png|gif)/gi.test(typeOfImage);
        if (!image) return null;
        return attachment;
    }


};
