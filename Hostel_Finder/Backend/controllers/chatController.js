const asyncHandler = require("express-async-handler");
const Chat = require("../models/Chat");
const User = require("../models/User");
const Message = require("../models/Message");

// @desc    Create or fetch One to One Chat
// @route   POST /api/chat
// @access  Protected
const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    })
        .populate("users", "-password")
        .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "fullName profileImage email",
    });

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };

        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                "users",
                "-password"
            );
            res.status(200).json(FullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
});

// @desc    Fetch all chats for a user
// @route   GET /api/chat
// @access  Protected
// @desc    Fetch all chats for a user
// @route   GET /api/chat
// @access  Protected
const fetchChats = asyncHandler(async (req, res) => {
    try {
        let query;
        if (req.user.role === 'admin') {
            query = { deletedFor: { $ne: req.user._id } };
        } else {
            query = {
                users: { $elemMatch: { $eq: req.user._id } },
                deletedFor: { $ne: req.user._id }
            };
        }

        Chat.find(query)
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "fullName profileImage email",
                });
                res.status(200).send(results);
            });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

// @desc    Get all Messages
// @route   GET /api/chat/:chatId
// @access  Protected
const allMessages = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "fullName profileImage email")
            .populate("chat");
        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

// @desc    Send New Message
// @route   POST /api/chat/message
// @access  Protected
const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };

    try {
        var message = await Message.create(newMessage);

        message = await message.populate("sender", "fullName profileImage");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "fullName profileImage email",
        });

        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

// @desc    Edit Message
// @route   PUT /api/chat/message/:id
// @access  Protected
const editMessage = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { id } = req.params;

    if (!content) {
        res.status(400);
        throw new Error("Content is required");
    }

    let message = await Message.findById(id).populate("chat");

    if (!message) {
        res.status(404);
        throw new Error("Message not found");
    }

    // Verify ownership
    if (message.sender.toString() !== req.user.id) {
        res.status(401);
        throw new Error("Not authorized to edit this message");
    }

    message.content = content;
    message.isEdited = true;
    message.editedAt = Date.now();
    await message.save();

    // Populate for socket
    message = await message.populate("sender", "fullName profileImage");
    message = await message.populate("chat");
    message = await User.populate(message, {
        path: "chat.users",
        select: "fullName profileImage email",
    });

    // Emit event
    const io = req.app.get('socketio');
    message.chat.users.forEach(user => {
        io.in(user._id.toString()).emit('message updated', message);
    });

    res.json(message);
});

// @desc    Delete Message
// @route   DELETE /api/chat/message/:id
// @access  Protected
const deleteMessage = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { mode } = req.query; // 'everyone' or 'me'

    let message = await Message.findById(id).populate("chat");

    if (!message) {
        res.status(404);
        throw new Error("Message not found");
    }

    // Populate for socket emission before potential modification
    message = await message.populate("sender", "fullName profileImage");
    message = await message.populate("chat");
    message = await User.populate(message, {
        path: "chat.users",
        select: "fullName profileImage email",
    });

    // Check authorization
    if (mode === 'everyone') {
        if (message.sender._id.toString() !== req.user.id) {
            res.status(401);
            throw new Error("Not authorized to delete for everyone");
        }
        message.content = "This message was deleted";
        message.isDeleted = true;
        await message.save();
    } else {
        // Delete for me
        // Add user to deletedFor array if not already there
        if (!message.deletedFor.includes(req.user.id)) {
            message.deletedFor.push(req.user.id);
            await message.save();
        }
    }

    // Emit event
    const io = req.app.get('socketio');
    const evenData = {
        messageId: message._id,
        chatId: message.chat._id,
        mode: mode,
        deletedBy: req.user.id,
        isDeleted: message.isDeleted,
        updatedContent: message.content // Send updated content for "deleted for everyone"
    };

    message.chat.users.forEach(user => {
        // Only emit 'everyone' delete to others. 'me' delete is local (except for sender needing confirm)
        // But cleaner to emit and let frontend filter or update
        io.in(user._id.toString()).emit('message deleted', evenData);
    });

    res.json({ message: "Message deleted" });
});

// @desc    Delete Chat
// @route   DELETE /api/chat/:id
// @access  Protected
const deleteChat = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const id = chatId;
    const { mode } = req.query; // 'everyone' or 'me'

    const chat = await Chat.findById(id);

    if (!chat) {
        res.status(404);
        throw new Error("Chat not found");
    }

    if (mode === 'everyone') {
        // Only Admin can delete for everyone
        if (req.user.role !== 'admin') {
            res.status(401);
            throw new Error("Not authorized to delete for everyone");
        }

        // Hard Delete
        await Message.deleteMany({ chat: id });
        await Chat.findByIdAndDelete(id);

        const io = req.app.get('socketio');
        // Notify all users in the chat
        chat.users.forEach(userId => {
            io.in(userId.toString()).emit('chat deleted', { chatId: id, mode: 'everyone' });
        });

        if (!chat.users.includes(req.user._id)) {
            io.in(req.user._id.toString()).emit('chat deleted', { chatId: id, mode: 'everyone' });
        }

        res.json({ message: "Chat deleted for everyone" });

    } else {
        // Delete for Me
        // Add user to deletedFor array if not already there
        if (!chat.deletedFor.includes(req.user._id)) {
            chat.deletedFor.push(req.user._id);
            await chat.save();
        }
        res.json({ message: "Chat deleted for you" });
    }
});

module.exports = {
    accessChat,
    fetchChats,
    allMessages,
    sendMessage,
    editMessage,
    deleteMessage,
    deleteChat
};
