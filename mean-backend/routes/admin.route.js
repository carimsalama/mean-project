const router = require('express').Router();
const { getReports } = require('../controller/admin.controller');

const { protect, isAdmin } = require('../middleware/auth.middleware');




router.use(protect, isAdmin); // All admin routes require login + admin role
// Reports
router.get('/reports', getReports);


module.exports = router;
