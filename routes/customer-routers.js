const express = require('express');
const router = express.Router();

const {saveCustomer,    
        getAllCustomer,
        updateCustomer,
        deleteCustomer,
        getCustomerById} = require('../Controllers/customer-controller');

router.post('/', saveCustomer);
router.get('/', getAllCustomer);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);
router.get('/:id', getCustomerById);

module.exports = router;