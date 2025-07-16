const express = require('express');
const router = express.Router();

const { saveItems,
        getAllItems,
        updateItems,
        deleteItems,
        getItemsById,
        verifyToken,
        upload
                    } = require('../Controllers/iteams-controller');

// Public routes - no authentication required
router.get('/get', getAllItems);
router.get('/:id', getItemsById);

// Protected routes - require JWT authentication00
router.post('/',  upload.single('photo'), saveItems);
router.put('/:id', upload.single('photo'), updateItems);
router.delete('/:id', verifyToken, deleteItems);

module.exports = router;