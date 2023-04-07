const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const GuildSettings = require("../../Models/Antinuke");

module.exports = {
    name: ["antinuke", "whitelist", "remove"],
    description: "Remove a user from the whitelist for a specific antinuke category",
    category: "Antinuke",
    options: [
        {
            name: "user",
            description: "The user to add to the whitelist",
            required: true,
            type: ApplicationCommandOptionType.User,
          },
          {
            name: "category",
            description: "The category to whitelist the user for",
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
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
        user: []
    },
    settings: {
        isPremium: false,
        isPlayer: false,
        isOwner: false,
        inVoice: false,
        sameVoice: false,
    },
    run: async (interaction, client, user, language) => {

   const user1 = interaction.options.getUser('user');
  const category = interaction.options.getString('category');
  await interaction.deferReply();
    const ow = await GuildSettings.findOne({ guildId: interaction.guild.id });
    const isOwner = interaction.user.id === interaction.guild.ownerId;
    const isOwnerLevel = ow.ownerLevel.includes(interaction.user.id);

    if (!isOwner && !isOwnerLevel) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              "‼ This Command Is Only For Guild Owner And The Users That Have Access To ownerLevel"
            )
            .setColor(client.color),
        ],
      });
    }

    const guildSettings = await GuildSettings.findOne({ guildId: interaction.guild.id });
    if (!guildSettings) {
      return interaction.editReply({ content: 'Antinuke System Not Found', ephemeral: true });
    }

    const enabled = guildSettings.enabled[category];
    if (!enabled) {
      return interaction.editReply({ content: 'Antinuke is disabled for that category.', ephemeral: true });
    }

    const whitelist = guildSettings.whitelist[category];
    if (!whitelist.includes(user1.id)) {
      return interaction.editReply({ content: 'User is not in whitelist for that category.', ephemeral: true });
    } else {

    const index = whitelist.indexOf(user1.id);
    if (index > -1) {
      whitelist.splice(index, 1);
    }

    await guildSettings.save();

    const logChannel = interaction.guild.channels.cache.get(guildSettings.logChannel);

    if (logChannel) {
      const Anti = {
        roles: "AntiRole Create/Delete",
        channels: "AntiChannel Create/Delete",
        webhooks: "AntiWebhook Create/Delete/Update",
        kicks: "AntiKick",
        bans: "AntiBan",
        antibot: "AntiBots Add",
      };

      logChannel.send({
       embeds: [
        new EmbedBuilder()
        .setColor(client.color)
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL()})
        .addFields(
          {
            name: "Category",
            value: `> ${Anti[category]}`,
          },
          {
            name: "Log Type",
            value: "> Whitelist Remove"
          },
          {
            name: "Removed By",
            value: `> <@${interaction.user.id}>`
          },
          {
            name: "User Remobed",
            value: `> ${user1}`
          }
        )
        .setFooter({ text: `© Aksh Antinuke Logs`})
        .setTimestamp(),
       ]
      });
    }

    interaction.editReply({
      content: "The user has been Removed From whitelist for that category.",
      ephemeral: true,
    });

    

  

    }
  }
}