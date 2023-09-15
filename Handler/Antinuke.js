const { EmbedBuilder, AuditLogEvent, PermissionFlagsBits } = require("discord.js");
const GuildSettings = require("../../Models/Antinuke");

module.exports = (client) => {
  //=================================== Anti Channel Events ===================================//
  client.on("channelCreate", async (channel) => {
    if(!channel.guild.members.me.permissions.has(PermissionFlagsBits.ViewAuditLog)) return;
    const auditlogs = await channel.guild.fetchAuditLogs({
      type: AuditLogEvent.ChannelCreate,
      limit: 1,
    });
    const logs = auditlogs.entries.first();
    if(!logs) return;
    const { executor } = logs;

    await GuildSettings.findOne(
      { guildId: channel.guild.id },
      async (err, data) => {
        if(!data) return;
        const antinuke = data.enabled.channels;
        const trusted = data.whitelist.channels.includes(executor.id);
        const owner = data.ownerLevel.includes(executor.id);

        if (executor.id === channel.guild.ownerId) return;
        if (executor.id === client.user.id) return;
        if (antinuke === false) return;
        if (trusted === true) return;
        if (owner === true) return;

        channel.delete();
        const member = await channel.guild.members.fetch(executor.id);
        member.ban({ reason: "© Nityam Anti Channel Create" });

        const logChannel = channel.guild.channels.cache.get(data.logChannel);
        if (logChannel) {
          logChannel.send({
            embeds: [
              new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({
                  name: client.user.username,
                  iconURL: client.user.displayAvatarURL(),
                })
                .addFields(
                  {
                    name: "Category",
                    value: `> Anti Channel Create`,
                  },
                  {
                    name: "Log Type",
                    value: "> User Banned",
                  },
                  {
                    name: "User",
                    value: `> ${executor} ${executor.id}`,
                  },
                  {
                    name: "Reason",
                    value: `> Creating Channels`,
                  }
                )
                .setFooter({ text: `© Nityam Antinuke Logs` })
                .setTimestamp(),
            ],
          });
        }
      }
    );
  });

  client.on("channelDelete", async (channel) => {
    if(!channel.guild.members.me.permissions.has(PermissionFlagsBits.ViewAuditLog)) return;
    const auditlogs = await channel.guild.fetchAuditLogs({
      type: AuditLogEvent.ChannelDelete,
      limit: 1,
    });
    const logs = auditlogs.entries.first();
    if(!logs) return;
    const { executor } = logs;

    await GuildSettings.findOne(
      { guildId: channel.guild.id },
      async (err, data) => {
        if(!data) return;
        const antinuke = data.enabled.channels;
        const trusted = data.whitelist.channels.includes(executor.id);
        const owner = data.ownerLevel.includes(executor.id);

        if (executor.id === channel.guild.ownerId) return;
        if (executor.id === client.user.id) return;
        if (antinuke === false) return;
        if (trusted === true) return;
        if (owner === true) return;

        channel.clone();

        const member = await channel.guild.members.fetch(executor.id);
        member.ban({ reason: "© Nityam Anti Channel Delete" });

        const logChannel = channel.guild.channels.cache.get(data.logChannel);
        if (logChannel) {
          logChannel.send({
            embeds: [
              new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({
                  name: client.user.username,
                  iconURL: client.user.displayAvatarURL(),
                })
                .addFields(
                  {
                    name: "Category",
                    value: `> Anti Channel Delete`,
                  },
                  {
                    name: "Log Type",
                    value: "> User Banned",
                  },
                  {
                    name: "User",
                    value: `> ${executor} ${executor.id}`,
                  },
                  {
                    name: "Reason",
                    value: `> Deleting Channels`,
                  }
                )
                .setFooter({ text: `© Nityam Antinuke Logs` })
                .setTimestamp(),
            ],
          });
        }
      }
    );
  });

  client.on("channelUpdate", async (o, n) => {
    if(!n.guild.members.me.permissions.has(PermissionFlagsBits.ViewAuditLog)) return;
    const auditlogs = await n.guild.fetchAuditLogs({
      type: AuditLogEvent.ChannelUpdate,
      limit: 1,
    });
    const logs = auditlogs.entries.first();
    if(!logs) return;
    const { executor } = logs;

    await GuildSettings.findOne({ guildId: o.guild.id }, async (err, data) => {
      if(!data) return;
      const antinuke = data.enabled.channels;
      const trusted = data.whitelist.channels.includes(executor.id);
      const owner = data.ownerLevel.includes(executor.id);

      if (executor.id === o.guild.ownerId) return;
      if (executor.id === client.user.id) return;
      if (antinuke === false) return;
      if (trusted === true) return;
      if (owner === true) return;

      const oldName = o.name;
      const newName = n.name;

      const member = await n.guild.members.fetch(executor.id);
      member.ban({ reason: "© Nityam Anti Channel Update" });

      const logChannel = channel.guild.channels.cache.get(data.logChannel);
      if (logChannel) {
        logChannel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(client.color)
              .setAuthor({
                name: client.user.username,
                iconURL: client.user.displayAvatarURL(),
              })
              .addFields(
                {
                  name: "Category",
                  value: `> Anti Channel Update`,
                },
                {
                  name: "Log Type",
                  value: "> User Banned",
                },
                {
                  name: "User",
                  value: `> ${executor} ${executor.id}`,
                },
                {
                  name: "Reason",
                  value: `> Updating Channels`,
                }
              )
              .setFooter({ text: `© Nityam Antinuke Logs` })
              .setTimestamp(),
          ],
        });
      }

      if (oldName !== newName) {
        await n.edit({
          name: oldName,
        });
      }
      if (n.isText()) {
        const oldTopic = o.topic;
        const newTopic = n.topic;
        if (oldTopic !== newTopic) {
          await n.setTopic(oldTopic);
        }
      }
    });
  });

  //=================================== Anti Role Events ===================================//

  client.on("roleCreate", async (role) => {
    if(!role.guild.members.me.permissions.has(PermissionFlagsBits.ViewAuditLog)) return;
    const auditlogs = await role.guild.fetchAuditLogs({
      type: AuditLogEvent.RoleCreate,
      limit: 1,
    });
    const logs = auditlogs.entries.first();
    if(!logs) return;
    const { executor } = logs;

    await GuildSettings.findOne(
      { guildId: role.guild.id },
      async (err, data) => {
        if(!data) return;
        const antinuke = data.enabled.roles;
        const trusted = data.whitelist.roles.includes(executor.id);
        const owner = data.ownerLevel.includes(executor.id);

        if (executor.id === role.guild.ownerId) return;
        if (executor.id === client.user.id) return;
        if (antinuke === false) return;
        if (trusted === true) return;
        if (owner === true) return;

        role.delete();
        const member = await role.guild.members.fetch(executor.id);
        member.ban({ reason: "© Nityam Anti Role Create" });

        const logChannel = role.guild.channels.cache.get(data.logChannel);
        if (logChannel) {
          logChannel.send({
            embeds: [
              new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({
                  name: client.user.username,
                  iconURL: client.user.displayAvatarURL(),
                })
                .addFields(
                  {
                    name: "Category",
                    value: `> Anti Role Create`,
                  },
                  {
                    name: "Log Type",
                    value: "> User Banned",
                  },
                  {
                    name: "User",
                    value: `> ${executor} ${executor.id}`,
                  },
                  {
                    name: "Reason",
                    value: `> Creating Roles`,
                  }
                )
                .setFooter({ text: `© Nityam Antinuke Logs` })
                .setTimestamp(),
            ],
          });
        }
      }
    );
  });

  client.on("roleUpdate", async (o, n) => {
    if(!n.guild.members.me.permissions.has(PermissionFlagsBits.ViewAuditLog)) return;
    const auditlogs = await n.guild.fetchAuditLogs({
      type: AuditLogEvent.RoleUpdate,
      limit: 1,
    });
    const logs = auditlogs.entries.first();
    if(!logs) return;
    const { executor } = logs;

    await GuildSettings.findOne({ guildId: o.guild.id }, async (err, data) => {
      if(!data) return;
      const antinuke = data.enabled.roles;
      const trusted = data.whitelist.roles.includes(executor.id);
      const owner = data.ownerLevel.includes(executor.id);

      if (executor.id === n.guild.ownerId) return;
      if (executor.id === client.user.id) return;
      if (antinuke === false) return;
      if (trusted === true) return;
      if (owner === true) return;

      n.setPermissions(o.permissions);
      const member = await n.guild.members.fetch(executor.id);
      member.ban({ reason: "© Nityam Anti Role Update" });

      const logChannel = role.guild.channels.cache.get(data.logChannel);
      if (logChannel) {
        logChannel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(client.color)
              .setAuthor({
                name: client.user.username,
                iconURL: client.user.displayAvatarURL(),
              })
              .addFields(
                {
                  name: "Category",
                  value: `> Anti Role Update`,
                },
                {
                  name: "Log Type",
                  value: "> User Banned",
                },
                {
                  name: "User",
                  value: `> ${executor} ${executor.id}`,
                },
                {
                  name: "Reason",
                  value: `> Updating Roles`,
                }
              )
              .setFooter({ text: `© Nityam Antinuke Logs` })
              .setTimestamp(),
          ],
        });
      }
    });
  });

  client.on("roleDelete", async (role) => {
    if(!role.guild.members.me.permissions.has(PermissionFlagsBits.ViewAuditLog)) return;
    const auditlogs = await role.guild.fetchAuditLogs({
      type: AuditLogEvent.RoleDelete,
      limit: 1,
    });
    const logs = auditlogs.entries.first();
    if(!logs) return;
    const { executor } = logs;

    await GuildSettings.findOne(
      { guildId: role.guild.id },
      async (err, data) => {
        if(!data) return;
        const antinuke = data.enabled.roles;
        const trusted = data.whitelist.roles.includes(executor.id);
        const owner = data.ownerLevel.includes(executor.id);

        if (executor.id === role.guild.ownerId) return;
        if (executor.id === client.user.id) return;
        if (antinuke === false) return;
        if (trusted === true) return;
        if (owner === true) return;
        if (role.managed) return;

        role.guild.roles.create({ name: role.name, color: role.color });
        const member = await role.guild.members.fetch(executor.id);
        member.ban({ reason: "© Nityam Anti Role Delete" });

        const logChannel = role.guild.channels.cache.get(data.logChannel);
        if (logChannel) {
          logChannel.send({
            embeds: [
              new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({
                  name: client.user.username,
                  iconURL: client.user.displayAvatarURL(),
                })
                .addFields(
                  {
                    name: "Category",
                    value: `> Anti Role Delete`,
                  },
                  {
                    name: "Log Type",
                    value: "> User Banned",
                  },
                  {
                    name: "User",
                    value: `> ${executor} ${executor.id}`,
                  },
                  {
                    name: "Reason",
                    value: `> Deleting Roles`,
                  }
                )
                .setFooter({ text: `© Nityam Antinuke Logs` })
                .setTimestamp(),
            ],
          });
        }
      }
    );
  });

  //=================================== Anti Member Events ===================================//
  client.on("guildMemberUpdate", async (o, n) => {
    if(!n.guild.members.me.permissions.has(PermissionFlagsBits.ViewAuditLog)) return;
    const auditLogs = await n.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.MemberRoleUpdate,
    });
    const logs = auditLogs.entries.first();
    if(!logs) return;
    const { executor, target } = logs;

    await GuildSettings.findOne({ guildId: o.guild.id }, async (err, data) => {

      if(!data) return;
      const antinuke = data.enabled.roles;
      const trusted = data.whitelist.roles.includes(executor.id);
      const owner = data.ownerLevel.includes(executor.id);

      if (antinuke === false) return;
      if (trusted === true) return;
      if (owner === true) return;
      if (executor.id === client.user.id) return;
      if (executor.id === n.guild.ownerId) return;

      const oldRoles = o.roles;
      const newRoles = n.roles;

      if (oldRoles !== newRoles) {
        n.roles.set(o.roles.cache);
      }

      const member = await n.guild.members.fetch(executor.id);
      member.ban({ reason: "© Nityam Anti Member Role Update" });

      const logChannel = role.guild.channels.cache.get(data.logChannel);
      if (logChannel) {
        logChannel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(client.color)
              .setAuthor({
                name: client.user.username,
                iconURL: client.user.displayAvatarURL(),
              })
              .addFields(
                {
                  name: "Category",
                  value: `> Anti Member Role Update`,
                },
                {
                  name: "Log Type",
                  value: "> User Banned",
                },
                {
                  name: "User",
                  value: `> ${executor} ${executor.id}`,
                },
                {
                  name: "Reason",
                  value: `> Updating Member Roles`,
                }
              )
              .setFooter({ text: `© Nityam Antinuke Logs` })
              .setTimestamp(),
          ],
        });
      }
    });
  });

  //=================================== Anti Ban Events ===================================//
  client.on("guildBanAdd", async (member) => {
    if(!member.guild.members.me.permissions.has(PermissionFlagsBits.ViewAuditLog)) return;
    const auditLogs = await member.guild.fetchAuditLogs({
      type: AuditLogEvent.MemberBanAdd,
      limit: 1,
    });
    const logs = auditLogs.entries.first();
    if(!logs) return;
    const { executor, target } = logs;

    await GuildSettings.findOne(
      { guildId: member.guild.id },
      async (err, data) => {
        if(!data) return;
        const antinuke = data.enabled.bans;
        const trusted = data.whitelist.bans.includes(executor.id);
        const owner = data.ownerLevel.includes(executor.id);

        if (antinuke === false) return;
        if (trusted === true) return;
        if (member.id !== target.id) return;
        if (owner === true) return;
        if (executor.id === client.user.id) return;
        if (executor.id === member.guild.ownerId) return;

        const member2 = member.guild.members.fetch(executor.id);
        member2.ban({ reason: "© Nityam Anti Member Ban " });

        const logChannel = member.guild.channels.cache.get(data.logChannel);
        if (logChannel) {
          logChannel.send({
            embeds: [
              new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({
                  name: client.user.username,
                  iconURL: client.user.displayAvatarURL(),
                })
                .addFields(
                  {
                    name: "Category",
                    value: `> Anti Member Ban`,
                  },
                  {
                    name: "Log Type",
                    value: "> User Banned",
                  },
                  {
                    name: "User",
                    value: `> ${executor} ${executor.id}`,
                  },
                  {
                    name: "Reason",
                    value: "> Baning Members",
                  },
                  {
                    name: "Target",
                    value: `> ${target} ${target.id}`,
                  }
                )
                .setFooter({ text: `© Nityam Antinuke Logs` })
                .setTimestamp(),
            ],
          });
        }
      }
    );
  });

  //=================================== Anti Kick Events ===================================//
  client.on("guildMemberRemove", async (member) => {
    if(!member.guild.members.me.permissions.has(PermissionFlagsBits.ViewAuditLog)) return;
    const auditLogs = await member.guild.fetchAuditLogs({
      type: AuditLogEvent.MemberKick,
      limit: 1,
    });
    const logs = auditLogs.entries.first();
    if(!logs) return;
    const { executor, target } = logs;

    await GuildSettings.findOne(
      { guildId: member.guild.id },
      async (err, data) => {
        if(!data) return;
        const antinuke = data.enabled.kicks;
        const trusted = data.whitelist.kicks.includes(executor.id);
        const owner = data.ownerLevel.includes(executor.id);

        if (executor.id === client.user.id) return;
        if (executor.id === member.guild.ownerId) return;
        if (antinuke === false) return;
        if (member.id !== target.id) return;
        if (trusted === true) return;
        if (owner === true) return;

        const member2 = member.guild.members.fetch(executor.id);
        member2.ban({ reason: "© Nityam Anti Member Kick " });

        const logChannel = member.guild.channels.cache.get(data.logChannel);
        if (logChannel) {
          logChannel.send({
            embeds: [
              new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({
                  name: client.user.username,
                  iconURL: client.user.displayAvatarURL(),
                })
                .addFields(
                  {
                    name: "Category",
                    value: `> Anti Member Kick`,
                  },
                  {
                    name: "Log Type",
                    value: "> User Banned",
                  },
                  {
                    name: "User",
                    value: `> ${executor} ${executor.id}`,
                  },
                  {
                    name: "Reason",
                    value: "> Kicking Members",
                  },
                  {
                    name: "Target",
                    value: `> ${target} ${target.id}`,
                  }
                )
                .setFooter({ text: `© Nityam Antinuke Logs` })
                .setTimestamp(),
            ],
          });
        }
      }
    );
  });

  //=================================== Anti Bot Events ===================================//
  client.on("guildMemberAdd", async (member) => {
    if(!member.guild.members.me.permissions.has(PermissionFlagsBits.ViewAuditLog)) return;
    const auditLogs = await member.guild.fetchAuditLogs({
      type: AuditLogEvent.BotAdd,
      limit: 1,
    });
    const logs = auditLogs.entries.first();
    if(!logs) return;
    const { executor, target } = logs;

    await GuildSettings.findOne(
      { guildId: member.guild.id },
      async (err, data) => {
        if(!data) return;
        const antinuke = data.enabled.antibot;
        const trusted = data.whitelist.antibot.includes(executor.id);
        const owner = data.ownerLevel.includes(executor.id);

        if (executor.id === client.user.id) return;
        if (executor.id === member.guild.ownerId) return;
        if (antinuke === false) return;
        if (trusted === true) return;
        if (!target.bot) return;
        if (owner === true) return;
        if (target.id !== member.id) return;

        const member3 = member.guild.members.fetch(executor.id);
        member3.ban({ reason: "© Nityam Anti Bot Add " });
        const member2 = member.guild.members.fetch(target.id);
        member2.ban({ reason: "© Nityam Anti Bot Add " });

        const logChannel = member.guild.channels.cache.get(data.logChannel);
        if (logChannel) {
          logChannel.send({
            embeds: [
              new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({
                  name: client.user.username,
                  iconURL: client.user.displayAvatarURL(),
                })
                .addFields(
                  {
                    name: "Category",
                    value: `> Anti Bot Add`,
                  },
                  {
                    name: "Log Type",
                    value: "> User Banned",
                  },
                  {
                    name: "User",
                    value: `> ${executor} ${executor.id}`,
                  },
                  {
                    name: "Reason",
                    value: "> Illegal Bot Add",
                  },
                  {
                    name: "Bot",
                    value: `> ${target} ${target.id}`,
                  }
                )
                .setFooter({ text: `© Nityam Antinuke Logs` })
                .setTimestamp(),
            ],
          });
        }
      }
    );
  });

  //=================================== Anti Webhook Events ===================================//

  client.on("webhookUpdate", async (webhook) => {
    if(!webhook.guild.members.me.permissions.has(PermissionFlagsBits.ViewAuditLog)) return;
    const auditLog = await webhook.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.WebhookUpdate,
    });
    const logs = auditLog.entries.first();
    if(!logs) return;
    const { executor } = logs;

    await GuildSettings.findOne(
      { guildId: webhook.guild.id },
      async (err, data) => {
        if(!data) return;
        const antinuke = data.enabled.webhooks;
        const trusted = data.whitelist.webhooks.includes(executor.id);
        const owner = data.ownerLevel.includes(executor.id);

        if (antinuke === false) return;
        if (trusted === true) return;
        if (owner === true) return;
        if (executor.id === client.user.id) return;
        if (executor.id === webhook.guild.ownerId) return;

        const member = webhook.guild.members.fetch(executor.id);
        member.ban({ reason: "© Nityam Anti Webhook Update" });

        const logChannel = webhook.guild.channels.cache.get(data.logChannel);
        if (logChannel) {
          logChannel.send({
            embeds: [
              new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({
                  name: client.user.username,
                  iconURL: client.user.displayAvatarURL(),
                })
                .addFields(
                  {
                    name: "Category",
                    value: `> Anti Webhook Update`,
                  },
                  {
                    name: "Log Type",
                    value: "> User Banned",
                  },
                  {
                    name: "User",
                    value: `> ${executor} ${executor.id}`,
                  },
                  {
                    name: "Reason",
                    value: "> Updating Webhook",
                  }
                )
                .setFooter({ text: `© Nityam Antinuke Logs` })
                .setTimestamp(),
            ],
          });
        }
      }
    );
  });

  client.on("webhookUpdate", async (webhook) => {
    if(!webhook.guild.members.me.permissions.has(PermissionFlagsBits.ViewAuditLog)) return;
    const auditLog = await webhook.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.WebhookCreate,
    });
    const logs = auditLog.entries.first();
    if(!logs) return;
    const { executor } = logs;

    await GuildSettings.findOne(
      { guildId: webhook.guild.id },
      async (err, data) => {
        if(!data) return;
        const antinuke = data.enabled.webhooks;
        const trusted = data.whitelist.webhooks.includes(executor.id);
        const owner = data.ownerLevel.includes(executor.id);

        if (antinuke === false) return;
        if (trusted === true) return;
        if (owner === true) return;
        if (executor.id === client.user.id) return;
        if (executor.id === webhook.guild.ownerId) return;

        const member = webhook.guild.members.fetch(executor.id);
        member.ban({ reason: "© Nityam Anti Webhook Create" });

        const logChannel = webhook.guild.channels.cache.get(data.logChannel);
        if (logChannel) {
          logChannel.send({
            embeds: [
              new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({
                  name: client.user.username,
                  iconURL: client.user.displayAvatarURL(),
                })
                .addFields(
                  {
                    name: "Category",
                    value: `> Anti Webhook Create`,
                  },
                  {
                    name: "Log Type",
                    value: "> User Banned",
                  },
                  {
                    name: "User",
                    value: `> ${executor} ${executor.id}`,
                  },
                  {
                    name: "Reason",
                    value: "> Creating Webhooks",
                  }
                )
                .setFooter({ text: `© Nityam Antinuke Logs` })
                .setTimestamp(),
            ],
          });
        }
      }
    );
  });

  client.on("webhookUpdate", async (webhook) => {
    if(!webhook.guild.members.me.permissions.has(PermissionFlagsBits.ViewAuditLog)) return;
    const auditLog = await webhook.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.WebhookDelete,
    });
    const logs = auditLog.entries.first();
    if(!logs) return;
    const { executor } = logs;

    await GuildSettings.findOne(
      { guildId: webhook.guild.id },
      async (err, data) => {
        if(!data) return;
        const antinuke = data.enabled.webhooks;
        const trusted = data.whitelist.webhooks.includes(executor.id);
        const owner = data.ownerLevel.includes(executor.id);

        if (antinuke === false) return;
        if (trusted === true) return;
        if (owner === true) return;
        if (executor.id === client.user.id) return;
        if (executor.id === webhook.guild.ownerId) return;

        const member = webhook.guild.members.fetch(executor.id);
        member.ban({ reason: "© Nityam Anti Webhook Delete" });

        const logChannel = webhook.guild.channels.cache.get(data.logChannel);
        if (logChannel) {
          logChannel.send({
            embeds: [
              new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({
                  name: client.user.username,
                  iconURL: client.user.displayAvatarURL(),
                })
                .addFields(
                  {
                    name: "Category",
                    value: `> Anti Webhook Delete`,
                  },
                  {
                    name: "Log Type",
                    value: "> User Banned",
                  },
                  {
                    name: "User",
                    value: `> ${executor} ${executor.id}`,
                  },
                  {
                    name: "Reason",
                    value: "> © Nityam Anti Webhook Delete",
                  }
                )
                .setFooter({ text: `© Nityam Antinuke Logs` })
                .setTimestamp(),
            ],
          });
        }
      }
    );
  });

  //=================================== Anti Guild Update ===================================//
  client.on('guildUpdate',  async (o, n) => {

    const auditLog = await o.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.GuildUpdate,
    });
           
    const logs = auditLog.entries.first();
          
    if (!logs) return;
    const { executor } = logs;
      
         await GuildSettings.findOne(
      { guildId: n.id },
      async (err, data) => {      
        if (!data) return;
        const antinuke = data.guildId;
        const trusted = data.whitelist.guildUpdate.includes(executor.id);
        const owner = data.ownerLevel.includes(executor.id);

        if (antinuke === false) return;
        if (trusted === true) return;
        if (owner === true) return;
        if (executor.id === client.user.id) return;
                 
          const oldIcon = o.iconURL();
          
          const oldName = o.name;
          
          const newIcon = n.iconURL();
          const newName = n.name;
          
          if (oldName !== newName) {
            await n.setName(oldName);
          }
          
          if (oldIcon !== newIcon) {
            await o.setIcon(oldIcon);
          }
          
          const member = await n.guild.members.fetch(executor.id);
          member.ban({ reason: "© Nityam Anti Guild Update" });
          const logChannel = webhook.guild.channels.cache.get(data.logChannel);
          if (logChannel) {
            logChannel.send({
              embeds: [
                new EmbedBuilder()
                  .setColor(client.color)
                  .setAuthor({
                    name: client.user.username,
                    iconURL: client.user.displayAvatarURL(),
                  })
                  .addFields(
                    {
                      name: "Category",
                      value: `> Anti Guild Update`,
                    },
                    {
                      name: "Log Type",
                      value: "> User Banned",
                    },
                    {
                      name: "User",
                      value: `> ${executor} ${executor.id}`,
                    },
                    {
                      name: "Reason",
                      value: "> © Nityam Anti Guild Update",
                    }
                  )
                  .setFooter({ text: `© Nityam Antinuke Logs` })
                  .setTimestamp(),
              ],
            });
          }
          
        
      })
  });
};
