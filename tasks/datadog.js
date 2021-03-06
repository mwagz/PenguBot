const { Task } = require("klasa");
const { StatsD } = require("hot-shots");
const dogstats = new StatsD();

module.exports = class extends Task {

    async run() {
        const allGuilds = await this.client.shard.fetchClientValues("guilds.size");
        const allVc = await this.client.shard.fetchClientValues("lavalink.size");
        dogstats.gauge("pengubot.cmdscounter", this.client.configs.counter.total);
        dogstats.gauge("pengubot.vc", allVc.reduce((prev, val) => prev + val, 0));
        return dogstats.gauge("pengubot.guilds", allGuilds.reduce((prev, val) => prev + val, 0));
    }

    // Init
    async init() {
        if (this.client.user.id !== "303181184718995457" && this.client.shard.id !== 0) return this.disable();
        if (!this.client.configs.schedules.some(schedule => schedule.taskName === this.name)) {
            await this.client.schedule.create("datadog", "*/1 * * * *");
        }
    }

};
