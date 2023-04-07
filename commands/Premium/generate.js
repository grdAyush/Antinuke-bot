const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
  } = require("discord.js");
  const moment = require('moment');
const voucher_codes = require('voucher-code-generator');
const Redeem = require("../../Models/Redeem");
  module.exports = {
    name: ["premium", "generate"],
    description: "generate a preniun code",
    category: "Premium",
    options: [ {
        name: "plan",
        description: "The plan you want to generate a voucher code for",
        required: true,
        type: ApplicationCommandOptionType.String,
        choices: [
            {
                name: "Daily",
                value: "daily",
            }
            ,{
                name: "Weekly",
                value: "weekly"
            },
            {
                name: "Monthly",
                value: "monthly"
            },
            {
                name: "Yearly",
                value: "yearly"
            },
            {
                name: "Lifetime",
                value: "lifetime"
            }
        ]
    },
    {
        name: "amount",
        description: "The amount of codes you want to generate",
        required: false,
        type: ApplicationCommandOptionType.String,
    }],
    permissions: {
      channel: [],
      bot: [],
      user: [],
    },
    settings: {
      isPremium: false,
      isOwner: true,
      inVoice: false,
      isNSFW: false,
    },
    run: async (interaction, client) => {

        await interaction.deferReply({ ephemeral: false });

        const name = interaction.options.getString("plan");
        const camount = interaction.options.getString("amount");

        let codes = [];

        const plan = name;

        let time;
        if (plan === 'daily') time = Date.now() + 86400000;
        if (plan === 'weekly') time = Date.now() + 86400000 * 7;
        if (plan === 'monthly') time = Date.now() + 86400000 * 30;
        if (plan === 'yearly') time = Date.now() + 86400000 * 365;
        if (plan === 'lifetime') time = Date.now() + 86400000 * 365 * 100;

        let amount = camount;
        if (!amount) amount = 1;

        for (var i = 0; i < amount; i++) {
        const codePremium = voucher_codes.generate({
            pattern: '####-####-####'
        })

        const code = codePremium.toString().toUpperCase()
        const find = await Redeem.findOne({ code: code })

        if (!find) {
            Redeem.create({
                code: code,
                plan: plan,
                expiresAt: time
            }),
                codes.push(`${i + 1} - ${code}`)
            }
        }

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: `Generate Code`, iconURL: client.user.avatarURL() }) //${lang.description.replace("{codes_length}", codes.length).replace("{codes}", codes.join('\n')).replace("{plan}", plan).replace("{expires}", moment(time).format('dddd, MMMM Do YYYY'))}
            .setDescription(`• *Generated* [\`${codes.length}\`]\n\`${codes.join("\n")}\`\n • *Plan*: \`${plan}\`\n • *Expires at*: \`${moment(time).format('dddd, MMMM Do YYYY')}\``)
            .setTimestamp()
            .setFooter({ text: `Type: /redeem <code> to redeem!`, iconURL: interaction.user.displayAvatarURL() })

        interaction.editReply({ embeds: [embed] })
    },
  };
  