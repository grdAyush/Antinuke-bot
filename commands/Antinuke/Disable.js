const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const GuildSettings = require("../../Models/Antinuke");

module.exports = {
  name: ["antinuke", "disable"],
  description: "Disable a specific antinuke category for the guild.",
  category: "Antinuke",
  options: [
    {
      name: "category",
      type: ApplicationCommandOptionType.String,
      required: true,
      description: "The antinuke category to disable.",
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

    if(interaction.user.id !== interaction.guild.ownerId){
      interaction.editReply({ content: `You Are Not Owner Of This Guild`, ephemeral: true });
  }

    const category = interaction.options.getString("category");
   



    let settings = await GuildSettings.findOne({ guildId: interaction.guild.id });
    if (!settings) return interaction.editReply({ content: "Antinuke Is Not Enabled In This Guild"})

    if (category === "all") {
      settings.enabled.roles = false;
      settings.enabled.channels = false;
      settings.enabled.webhooks = false;
      settings.enabled.kicks = false;
      settings.enabled.bans = false;
      settings.enabled.antibot = false;

      await settings.save();

      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("<a:antinuke:1087674015352623194> Antinuke Settings")
            .setDescription(
              `
        AntiRole Create/Delete:    <:disabled:1087683956197031976>,\n
        AntiChannel Create/Delete: <:disabled:1087683956197031976>,\n
        AntiWebhook Create/Delete: <:disabled:1087683956197031976>\n
        AntiKick:                  <:disabled:1087683956197031976>\n
        AntiBot Add:               <:disabled:1087683956197031976>\n
        AntiBan:                   <:disabled:1087683956197031976>
        `
            )
            .setColor(client.color)
            .setFooter({
              text: "Tip: You Have Disabled All Antinuke Category. If Any Suspicious Activity Is Done The Bot Will Do Nothing",
            }),
        ],
      });
    } else {

      if(settings.enabled[category] === false) {

        interaction.editReply({ 
          embeds: [
            new EmbedBuilder()
            .setDescription(`That Category Is not enabled`)
            .setColor("Red")
            .setTimestamp(),
          ],
          ephemeral: true
        })

      } else {

    settings.enabled[category] = true;
    await settings.save();

    const Anti = {
      roles: "AntiRole Create/Delete",
      channels: "AntiChannel Create/Delete",
      webhooks: "AntiWebhook Create/Delete/Update",
      kicks: "AntiKick",
      bans: "AntiBan",
      antibot: "AntiBots Add",
    };

    interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setDescription(`${Anti[category]} <:disabled:1087683956197031976>`)
          .setColor(client.color),
      ],
    });

  }
  }
  },
};
