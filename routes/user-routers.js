const express = require('express');
const router = express.Router();

const { saveUsers,
    getAllUsers,
    loginUser,
    verifyToken
} = require('../Controllers/user-controller');

router.post('/', saveUsers);
router.get('/', getAllUsers);
router.post('/login', loginUser);

// Protected route example - requires valid JWT token
router.get('/profile', verifyToken, (req, res) => {
    res.send({ 
        message: "Profile accessed successfully", 
        user: req.user 
    });
});

module.exports = router;