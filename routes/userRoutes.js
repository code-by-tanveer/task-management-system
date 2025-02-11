const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

router.get('/', authMiddleware.verifyToken, userController.getAllUsers);

router.post('/', authMiddleware.verifyToken, authMiddleware.isAdmin, userController.createUserByAdmin);
router.get('/:userId', authMiddleware.verifyToken, authMiddleware.isAdmin, userController.getUserByAdmin);
router.put('/:userId', authMiddleware.verifyToken, authMiddleware.isAdmin, userController.updateUserByAdmin);
router.delete('/:userId', authMiddleware.verifyToken, authMiddleware.isAdmin, userController.deleteUserByAdmin);

module.exports = router;