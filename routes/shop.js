const express = require('express');

// path package to know path of files
const path = require('path');
const rootDir = require('../util/path');
const adminData = require('./admin');

const shopController = require('../controllers/shop')
const isAuth = require('../middleware/is-auth');


const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:productId([0-9a-fA-F]{24})', shopController.getProduct);
router.get('/cart', isAuth, shopController.getCart);
router.post('/cart', isAuth, shopController.postCart);

router.post('/cart/delete', isAuth, shopController.postDeleteCart);
router.post('/create-order', isAuth, shopController.postOrder);

router.get('/orders', isAuth, shopController.getOrders);
router.get('/checkout', isAuth, shopController.getCheckout);

module.exports = router;
