const { green, white } = require('chalk');
const Premium = require('../../Models/Premium');

module.exports = async (client) => {
    console.log(white('[') + green('INFO') + white('] ') + green(`${client.user.tag} (${client.user.id})`) + white(` is Ready!`));

    const users = await Premium.find();
    for (let user of users) {
      client.premiums.set(user.Id, user);
    }

    let guilds = client.guilds.cache.size;
    let members = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0);
    let channels = client.channels.cache.size;

    const activities = [
        `Roaming In ${guilds} servers`,
        `${members} users`,
        `Working in ${channels} channels`,
    ]

    setInterval(() => {
        client.user.setPresence({ 
            activities: [{ name: `${activities[Math.floor(Math.random() * activities.length)]}`, type: 2 }], 
            status: 'online', 
        });
    }, 15000)

};
