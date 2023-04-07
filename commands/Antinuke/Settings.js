const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const GuildSettings = require("../../Models/Antinuke")
module.exports = {
    name: ["antinuke", "settings"],
    description: "check antinuke settings of the guild",
    category: "Antinuke",
    options: [],
    permissions: {
        channel: [],
        bot: [],
        user: ["Administrator"]
    },
    settings: {
        isPremium: false,
        isPlayer: false,
        isOwner: false,
        inVoice: false,
        sameVoice: false,
    },
    run: async (interaction, client, user, language) => {

       await interaction.deferReply();

       const data = await GuildSettings.findOne({ guildId: interaction.guild.id });
       if(!data) { interaction.editReply({ content: `No Data Found`, ephemeral: true});} else {
        const emoji = { true: "<:enable:1087674705726668863>", false: "<:disabled:1087683956197031976>"}


        interaction.editReply({ embeds: [
            new EmbedBuilder()
            .setTitle(`Antinuke Settings`)
            .setDescription(`
            Anti Role: ${emoji[data.enabled.roles]}\n
            Anti Webhook: ${emoji[data.enabled.webhooks]}\n
            Anti Ban : ${emoji[data.enabled.bans]}\n
            Anti Kick: ${emoji[data.enabled.kicks]}\n
            Anti Bot Add: ${emoji[data.enabled.antibot]}
            `)
            .setColor(client.color)
        ]})

       }
    }

}