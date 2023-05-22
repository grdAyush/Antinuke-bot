const { EmbedBuilder, ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const GuildSettings = require("../../Models/Antinuke");

module.exports = {
  name: ["antinuke", "enable"],
  description: "Enables a specific antinuke category for the guild.",
  category: "Antinuke",
  options: [
    {
      name: "category",
      type: ApplicationCommandOptionType.String,
      required: true,
      description: "The antinuke category to enable.",
      choices: [
        {
          name: "Anti All",
          value: "all",
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
    await interaction.deferReply();
    if(!interaction.guild.members.me.permissions.has(PermissionFlagsBits.Administrator)) interaction .channel.send({
      content: "**Warning**: I Don't Have Administrator Permission, Please Gimme Perms Of Administrator"
    })

    if(interaction.user.id !== interaction.guild.ownerId){
      interaction.editReply({ content: `You Are Not Owner Of This Guild`, ephemeral: true });
  }

    const category = interaction.options.getString("category");

    let settings = await GuildSettings.findOne({
      guildId: interaction.guild.id,
    });
    if (!settings) {
      settings = new GuildSettings({ guildId: interaction.guild.id });
    }

    if (category === "all") {
      settings.enabled.roles = true;
      settings.enabled.channels = true;
      settings.enabled.webhooks = true;
      settings.enabled.kicks = true;
      settings.enabled.bans = true;
      settings.enabled.antibot = true;

      await settings.save();

      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("<a:antinuke:1087674015352623194> Antinuke Settings")
            .setDescription(
              `
        AntiRole Create/Delete:    <:enable:1087674705726668863>,\n
        AntiChannel Create/Delete: <:enable:1087674705726668863>,\n
        AntiWebhook Create/Delete: <:enable:1087674705726668863>\n
        AntiKick:                  <:enable:1087674705726668863>\n
        AntiBot Add:               <:enable:1087674705726668863>\n
        AntiBan:                   <:enable:1087674705726668863>
        `
            )
            .setColor(client.color)
            .setFooter({
              text: "Tip: Use `/antinuke channel` To Setup Antinuke Log Channel",
            }),
        ],
      });
    } else {
      if (settings.enabled[category] === true) {
        interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.color)
              .setDescription(`Don't Worry That Category Is Already Enabled 😉`)
              .setTimestamp(),
          ],
          ephemeral: true,
        });
      } else {
        settings.enabled[category] = true;
        await settings.save();

        const Anti = {
      roles: "AntiRole",
      channels: "AntiChannel ",
      webhooks: "AntiWebhook",
      kicks: "AntiKick",
      bans: "AntiBan",
      antibot: "AntiBots Add",
    };

        interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`${Anti[category]} <:enable:1087674705726668863>`)
              .setColor(client.color)
              .setTimestamp(),
          ],
        });
      }
    }
  },
};
