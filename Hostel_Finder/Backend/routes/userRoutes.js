const express = require('express');
const router = express.Router();
const { toggleFavorite, getFavorites, updateUser, deleteUser, getAllUsers, getArchivedUsers, permanentDeleteUser, restoreUser, blockUser, unblockUser, getBlockedUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.get('/', protect, admin, getAllUsers);
router.get('/archived', protect, admin, getArchivedUsers);
router.put('/restore/:id', protect, admin, restoreUser);
router.route('/block').post(protect, admin, blockUser).get(protect, admin, getBlockedUsers);
router.delete('/block/:id', protect, admin, unblockUser);
router.post('/favorites/:id', protect, toggleFavorite);
router.get('/favorites', protect, getFavorites);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, deleteUser);
router.delete('/permanent/:id', protect, admin, permanentDeleteUser);

module.exports = router;
