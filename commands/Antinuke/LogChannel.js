const { EmbedBuilder, ApplicationCommandOptionType, ChannelType} = require('discord.js');
const GuildSettings = require("../../Models/Antinuke")

module.exports = {
    name: ["antinuke", "channel"],
    description: "Set the log channel for all antinuke categories.",
    category: "Antinuke",
    options: [
        {
            name: "channel",
            type: ApplicationCommandOptionType.Channel,
            channel_types: [ChannelType.GuildText],
            description: "The channel to set as the log channel.",
            required: true
        }
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
      await interaction.deferReply();

    
      const ow = await GuildSettings.findOne({ guildId: interaction.guild.id });
  
      const isOwner = interaction.user.id === interaction.guild.ownerId;
      const isOwnerLevel = ow.ownerLevel.includes(interaction.user.id);
  
      if (!isOwner && !isOwnerLevel) {
        return   interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setDescription("‼ This Command Is Only For Guild Owner And The Users That Have Access To ownerLevel")
              .setColor(client.color),
          ],
        });
      
      }
          const guildId = interaction.guildId;
          const logChannel = interaction.options.getChannel('channel');


          const guildSettings = await GuildSettings.findOne({ guildId: guildId });
          if (!guildSettings) {
            return interaction.editReply({
              content: 'Antinuke is not enabled in this guild. Please enable it first.',
              ephemeral: true,
            });
          }

          guildSettings.logChannel = logChannel.id;
          await guildSettings.save();

          interaction.editReply({ content: `Log Channel Has Been Set To <#${logChannel.id}>` });


    }

}