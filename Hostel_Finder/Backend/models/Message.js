const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
    {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        content: { type: String, trim: true },
        chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
        readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        isDeleted: { type: Boolean, default: false },
        deletedFor: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of users for whom this message is deleted
        isEdited: { type: Boolean, default: false },
        editedAt: { type: Date },
        replyTo: { type: mongoose.Schema.Types.ObjectId, ref: "Message" } // Future use
    },
    {
        timestamps: true,
    }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
