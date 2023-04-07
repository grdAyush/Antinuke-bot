const mongoose = require('mongoose');
const { MONGO_URI } = require("../../Settings/config")
module.exports = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        })
    } catch (error) {
        console.log(error);
    }
} 