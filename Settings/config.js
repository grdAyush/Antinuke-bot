require("dotenv").config();
module.exports = {
    webhook: {
        error: "" || process.env.error, //webhook link where error logs are sent
        join: "" || process.env.join, //webhook link where join logs are sent
        leave: "" || process.env.leave, //webhook link where leave logs are sent
    },

    TOKEN: "" || process.env.TOKEN, //Your Bot Token
    MONGO_URI: "" || process.env.MONGO_URI, //Mongo Uri
    EMBED_COLOR: "" || process.env.EMBED_COLOR, //Embed Color
    DEV_ID: "" || process.env.DEV_ID, //Developer ID
    OWNER_ID: "" || process.env.OWNER_ID, //Owner ID

}