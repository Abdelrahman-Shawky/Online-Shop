const express = require('express');
const path = require('path');
const {check, body} = require('express-validator/check');


const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/products', isAuth, adminController.getProducts);
router.get('/add-product', isAuth, adminController.getAddProduct);
router.post('/add-product', [
    body('title')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('imageUrl').isURL(),
    body('price').isFloat(),
    body('description')
      .isLength({ min: 5, max: 400 })
      .trim()
], isAuth, adminController.postAddProduct);
router.get('/edit-product/:productId([0-9a-fA-F]{24})', isAuth, adminController.getEditProduct)
router.post('/edit-product', [
    body('title')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('imageUrl').isURL(),
    body('price').isFloat(),
    body('description')
      .isLength({ min: 5, max: 400 })
      .trim()
], isAuth, adminController.postEditProduct);
router.delete('/product/:productId', isAuth, adminController.deleteProduct)

module.exports = router;
