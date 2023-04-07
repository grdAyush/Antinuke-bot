const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const AntinukeGuildSettings = require("../../Models/Antinuke")
module.exports = {
    name: ["antinuke", "whitelist", "show"],
    description: "Shows the whitelist of users for a selected antinuke category",
    category: "Antinuke",
    options: [
        {
            name: "category",
            description: "The category to whitelist the user for",
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
              {
                name: "Owner Level",
                value: "owner",
              },
              {
                name: "AntiRole",
                value: "roles",
              },
              {
                name: "AntiChannel",
                value: "channels",
              },
              {
                name: "AntiWebhook",
                value: "webhooks",
              },
              {
                name: "AntiBot Add",
                value: "antibot",
              },
              {
                name: "AntiKick",
                value: "kicks",
              },
              {
                name: "AntiBan",
                value: "bans",
              },
            ],
          },
    ],
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

        const guildSettings = await AntinukeGuildSettings.findOne({ guildId: interaction.guild.id });
    if (!guildSettings) {
      return interaction.editReply({ content: 'Antinuke is not enabled for this guild!', ephemeral: true });
    }


    
    const category = interaction.options.getString('category');

    
    if(category === "owner") {
      const whitelist = guildSettings.ownerLevel

      const users = await Promise.all(
        whitelist.map(async (userId) => {
          return `<@${userId}> - \`${userId}\``;
        })
      );

      
      if (!whitelist || whitelist.length === 0) return interaction.editReply({ content: 'No users are in owner whitelist', ephemeral: true });
      const embed = new EmbedBuilder()
      .setColor(client.color)
      .setTitle(`Whitelisted users for Owner Level`)
      .setDescription(users.join('\n'));
  
    return interaction.editReply({ embeds: [embed] });

    } else {
    const whitelist = guildSettings.whitelist[category];


    if (!whitelist || whitelist.length === 0) {
      return interaction.editReply({ content: 'No users are whitelisted for this antinuke category!', ephemeral: true });
    }

    const users = await Promise.all(
      whitelist.map(async (userId) => {
        return `<@${userId}> - \`${userId}\``;
      })
    );

    const Anti = {
      roles: "AntiRole",
      channels: "AntiChannel ",
      webhooks: "AntiWebhook",
      kicks: "AntiKick",
      bans: "AntiBan",
      antibot: "AntiBots Add",
    };

    

    const embed = new EmbedBuilder()
    .setColor(client.color)
    .setTitle(`Whitelisted users for ${Anti[category]}`)
    .setDescription(users.join('\n'));

  return interaction.editReply({ embeds: [embed] });
  }
    }

}