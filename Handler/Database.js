const { white, green } = require("chalk");

module.exports = (client) => {
    require("./Database/Connect.js")(client);
    require("./Database/Premium.js")(client);
    console.log(white('[') + green('INFO') + white('] ') + green('Database ') + white('Events') + green(' Loaded!'));
};