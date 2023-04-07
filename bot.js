const { Client, GatewayIntentBits, Collection } = require("discord.js");

class MainClient extends Client {
	 constructor() {
        super({
            shards: "auto",
            allowedMentions: { parse: ["users", "roles"] },
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.MessageContent,
            ]
        });

    this.config = require("./Settings/config.js");
    this.owner = this.config.OWNER_ID;
    this.dev = this.config.DEV_ID;
    this.color = this.config.EMBED_COLOR;
    if(!this.token) this.token = this.config.TOKEN;

    process.on('unhandledRejection', error => console.log(error));
    process.on('uncaughtException', error => console.log(error));

    const client = this;

    ["slash", "premiums"].forEach(x => client[x] = new Collection());
    ["Command", "Antinuke", "errLogger","Events", "Database",].forEach(x => require(`./Handler/${x}`)(client));

	}
		connect() {
        return super.login(this.token);
    };
};

module.exports = MainClient;