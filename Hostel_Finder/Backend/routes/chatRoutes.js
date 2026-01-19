const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
    accessChat,
    fetchChats,
    allMessages,
    sendMessage,
    editMessage,
    deleteMessage,
    deleteChat,
    markMessagesAsRead
} = require("../controllers/chatController");

const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/message").post(protect, sendMessage);
router.route("/message/:id").put(protect, editMessage).delete(protect, deleteMessage);
router.route("/:chatId/read").put(protect, markMessagesAsRead);
router.route("/:chatId").get(protect, allMessages).delete(protect, deleteChat);

module.exports = router;
