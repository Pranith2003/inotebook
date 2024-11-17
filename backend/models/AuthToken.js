const mongoose = require("mongoose");
const TokenSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    token:{
        type: String
    },
    action:{
        type: String
    }
});

module.exports = mongoose.model("token", TokenSchema);
