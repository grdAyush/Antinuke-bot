const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
  } = require("discord.js");
  const Premium = require("../../Models/Premium")
  module.exports = {
    name: ["premium", "remove"],
    description: "Remove Premium From A User",
    category: "Premium",
    options: [
        {
            name: "target",
            description: "Mention a user want to remove!",
            required: true,
            type: ApplicationCommandOptionType.User,
        }
    ],
    permissions: {
      channel: [],
      bot: [],
      user: [],
    },
    settings: {
      isPremium: false,
      isOwner: false,
      inVoice: false,
      isNSFW: false,
    },
    run: async (interaction, client) => {

        await interaction.deferReply({ ephemeral: false });
        
        const mentions = interaction.options.getUser("target");
        
        const db = await Premium.findOne({ Id: mentions.id });

        if (db.isPremium) {
            db.isPremium = false
            db.premium.redeemedBy = []
            db.premium.redeemedAt = null
            db.premium.expiresAt = null
            db.premium.plan = null

            const newUser = await db.save({ new: true }).catch(() => {})
            client.premiums.set(newUser.Id, newUser);

            const embed = new EmbedBuilder()
                .setDescription(`Successfully Removed The Premium From ${mentions}`)
                .setColor(client.color)

            interaction.editReply({ embeds: [embed] });

        } else {
            const embed = new EmbedBuilder()
                .setDescription(`That User Not Have Premium`)
                .setColor(client.color)

            interaction.editReply({ embeds: [embed] });
        }

    },
  };
  