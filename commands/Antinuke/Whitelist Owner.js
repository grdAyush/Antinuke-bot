const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const GuildSettings = require("../../Models/Antinuke"); 


module.exports = {
  name: ["antinuke", "whitelist", "owner"],
  description: "Add or remove a user to/from the owner level for this guild.",
  category: "Antinuke",
  options: [
    {
      name: "user",
      description: "The user to add/remove from the owner level.",
      required: true,
      type: ApplicationCommandOptionType.User,
    },
    {
      name: "choice",
      description: "Whether to add or remove the user from the owner level.",
      required: true,
      type: ApplicationCommandOptionType.String,
      choices: [
        {
            name: "Add", value: "add"
        },
        {
            name: "Remove", value: "remove"
        }
      ]
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



    const guildSettings = await GuildSettings.findOne({ guildId: interaction.guild.id });
    if (!guildSettings) {
        return interaction.editReply({ content: 'Something went wrong. Could not find guild settings.', ephemeral: true });
    };
    const userOption = interaction.options.getUser('user');
        if (guildSettings.ownerLevel.includes(userOption.id) && interaction.options.getString('choice') === 'add') {
            return interaction.editReply({ content: 'This user is already in the owner level list.', ephemeral: true });
        }

        if (!guildSettings.ownerLevel.includes(userOption.id) && interaction.options.getString('choice') === 'remove') {
            return interaction.editReply({ content: 'This user is not in the owner level list.', ephemeral: true });
        }

        if (interaction.options.getString('choice') === 'add') {
            guildSettings.ownerLevel.push(userOption.id);
            await guildSettings.save();
            return interaction.editReply({ content: `${userOption} has been added to the owner level list.`, ephemeral: true });
        } else {
            guildSettings.ownerLevel = guildSettings.ownerLevel.filter(userId => userId !== userOption.id);
            await guildSettings.save();
            return interaction.editReply({ content: `${userOption} has been removed from the owner level list.`, ephemeral: true });
        }



  },
};
