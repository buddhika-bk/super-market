const express = require('express');
const router = express.Router();

const { saveUsers,
    getAllUsers,
    loginUser
} = require('../Controllers/user-controller');

router.post('/', saveUsers);
router.get('/', getAllUsers);
router.post('/login',loginUser)

module.exports = router;