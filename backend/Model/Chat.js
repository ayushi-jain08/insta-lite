const mongoose = require("mongoose")

const ChatSchema = new mongoose.Schema({
    Chatusers : {
        type: Array,
        required: true
    },
    message : {
        type: String,
        required: true
    },
    sender: {
        type:  mongoose.Schema.Types.ObjectId,
       ref:"User"
    },
    chatType: {
        type: String,
        default: 'single', // Indicates group chat
      },
}, {timestamps: true})

module.exports = mongoose.model("Chat", ChatSchema)