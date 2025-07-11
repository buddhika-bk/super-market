const express = require('express');
const router = express.Router();

const { saveItems,
        getAllItems,
        updateItems,
        deleteItems,
        getItemsById
                    } = require('../Controllers/iteams-controller');

router.post('/', saveItems);
router.get('/', getAllItems);
router.put('/:id', updateItems);
router.delete('/:id', deleteItems);
router.get('/:id', getItemsById);

module.exports = router;