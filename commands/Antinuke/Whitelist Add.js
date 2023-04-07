const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const GuildSettings = require("../../Models/Antinuke");

module.exports = {
  name: ["antinuke", "whitelist", "add"],
  description: "Add user to the whitelist for a specific category",
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
    user: [],
  },
  settings: {
    isPremium: false,
    isPlayer: false,
    isOwner: false,
    inVoice: false,
    sameVoice: false,
  },
  run: async (interaction, client, user, language) => {
    await interaction.deferReply({ ephemeral: true });
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

    const user1 = interaction.options.getUser("user");
    const category = interaction.options.getString("category");

    const settings = await GuildSettings.findOne({
      guildId: interaction.guild.id,
    });
    if (!settings) {
      return interaction.editReply({
        content:
          "There was an error fetching the guild settings from the database. I Think You Never Used Antinuke Enable Command",
        ephemeral: true,
      });
    }

    if (!settings.enabled[category]) {
      return interaction.editReply({
        content: "Antinuke is disabled for that category.",
        ephemeral: true,
      });
    }

    if (!settings.logChannel) {
      return interaction.editReply({
        content: "Set the log channel first by using `/antinuke channel`.",
        ephemeral: true,
      });
    }

    if (settings.whitelist[category].includes(user1.id)) {
      return interaction.editReply({
        content: "The user is already whitelisted for that category.",
        ephemeral: true,
      });
    } else {
      settings.whitelist[category].push(user1.id);
      await settings.save();

      const logChannel = interaction.guild.channels.cache.get(
        settings.logChannel
      );

      if (logChannel) {
        const Anti = {
      roles: "AntiRole",
      channels: "AntiChannel ",
      webhooks: "AntiWebhook",
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
              value: "> Whitelist Add"
            },
            {
              name: "Added By",
              value: `> <@${interaction.user.id}>`
            },
            {
              name: "User Added",
              value: `> ${user1}`
            }
          )
          .setFooter({ text: `© Aksh Antinuke Logs`})
          .setTimestamp(),
         ]
        });
      }

      interaction.editReply({
        content: "The user has been added to the whitelist for that category.",
        ephemeral: true,
      });
    }
  },
};
