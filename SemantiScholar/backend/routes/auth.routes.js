const express = require("express");
const multer = require("multer");
const router = express.Router();
const { registerUser, loginUser, getMe, changePassword, updateProfile } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth");

// Configure multer for avatar uploads (memory storage, 2MB limit)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/change-password", protect, changePassword);
router.put("/profile", protect, upload.single("avatar"), updateProfile);

module.exports = router;
