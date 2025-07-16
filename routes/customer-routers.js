const express = require('express');
const router = express.Router();

const {saveCustomer,    
        getAllCustomer,
        updateCustomer,
        deleteCustomer,
        getCustomerById,
        verifyToken,
        upload   } = require('../Controllers/customer-controller');

router.post('/',  upload.single('photo'), saveCustomer);
router.get('/get', getAllCustomer);
router.put('/:id', verifyToken, updateCustomer);
router.delete('/:id', verifyToken, deleteCustomer);
router.get('/:id',getCustomerById);

module.exports = router;