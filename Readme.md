
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=200&section=header&text=Ayush Dev&fontSize=80&fontAlignY=35&animation=twinkling&fontColor=gradient"/> 
</p>

<p align="center"> 
  <a href="https://discord.gg/P6DNKS96TE" target="_blank">
    <img src="https://discordapp.com/api/guilds/975757167950962768/widget.png?style=banner2"/>
  </a>
</p>

# Ayush Dev's AntiNuke Discord Bot

![GitHub stars](https://img.shields.io/github/stars/grdAyush/Antinuke-bot?style=for-the-badge)
![GitHub license](https://img.shields.io/github/license/grdAyush/Antinuke-bot?style=for-the-badge)
![GitHub issues](https://img.shields.io/github/issues-raw/grdAyush/Antinuke-bot?style=for-the-badge)

## Features

- [x] MongoDB Connection
- [x] Anti Role Create/Delete/Update
- [x] Anti Bot Add
- [x] Anti Channel Create/Delete/Update
- [x] Anti Webhook Create/Delete/Update
- [x] Anti Kick
- [x] Anti Ban
- [x] Anti Guild Update (Stickers and Emojis)
- [x] Recovery of Channels And Roles
- [x] Slash Command (Base, Group, Sub)
- [x] Whitelist With Categories
- [x] Owner Level Whitelist
- [x] Log Channel

<details><summary>Requirements</summary>

### Requirements

- [x] Node.js v16+ [Download Node.js](https://nodejs.org/en/download/)
- [x] Discord Bot Token [Bot Token Guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)
- [x] MongoDB [Download MongoDB](https://www.mongodb.com/try/download/community) (Download & install = Finish!)

</details>

## Installation

```bash
git clone https://github.com/grdAyush/Antinuke-bot
cd Antinuke-bot
npm install or bun install
```

<details><summary>Configuration</summary>

### Configuration

Copy or Rename `.env.example` to `.env` and fill out the values:

```env
# Bot
TOKEN=REPLACE_HERE
EMBED_COLOR=#000001

# Dev
OWNER_ID=REPLACE_HERE

# Database
MONGO_URI=

# Webhook Logs Link
error=
join=
leave=
```

After installation, run the bot using:

```bash
npm run start or bun run start
```

</details>

<details><summary>Commands</summary>

### Commands

> Note: The default prefix is '/'

👮‍♂️ **Antinuke**
- Enable (/antinuke enable [category])
- Disable (/antinuke disable [category])
- LogChannel (/antinuke channel [channel])
- Settings (/antinuke settings)
- Whitelist Add (/antinuke whitelist add [user] [category])
- Whitelist Remove (/antinuke whitelist remove [user] [category])
- Whitelist Owner (/antinuke whitelist owner [user] [choice(add/remove)])
- Whitelist Show (/antinuke whitelist show [category])

💬 **Utility**
- Ping (/ping)
- Help (/help)

💎 **Premium Commands!**
- Generate (/premium generate [plan] [amount]) // (OWNER ONLY)
- Redeem (/redeem [code])
- Remove (/premium remove [mention]) // (OWNER ONLY)

</details>

## Credits

Created By [Ayush](https://github.com/grdAyush)


