const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

module.exports = router;
