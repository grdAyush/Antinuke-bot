const mongoose = require('mongoose');

const guildSettingsSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  whitelist: {
    roles: [{ type: String }],
    channels: [{ type: String }],
    webhooks: [{ type: String }],
    kicks: [{ type: String }],
    bans: [{ type: String }],
    antibot: [{ type: String }],
  },
  actions: [{
    userId: { type: String, required: true },
    category: { type: String, enum: ['roles', 'channels', 'webhooks', 'kicks', 'bans', 'antibot'], required: true },
    timestamp: { type: Date, default: Date.now },
  }],
  logChannel: { type: String, default: null },
  enabled: {
    roles: { type: Boolean, default: false },
    channels: { type: Boolean, default: false },
    webhooks: { type: Boolean, default: false },
    kicks: { type: Boolean, default: false },
    bans: { type: Boolean, default: false },
    antibot: { type: Boolean, default: false },
  },
  ownerLevel: [{ type: String, default: null }],
});

module.exports = mongoose.model('GuildSettings4', guildSettingsSchema);
