const express = require('express');

// path package to know path of files
const path = require('path');
const rootDir = require('../util/path');
const adminData = require('./admin');

const productsController = require('../controllers/products')

const router = express.Router();

router.get('/', productsController.getProducts);

module.exports = router;
