const Product = require('../models/product');
const mongoose = require('mongoose');
const Order = require('../models/order');


exports.getProducts = (req, res, next) =>{
    Product.find()
    .then(products => {
        res.render('shop/product-list', {
            prods: products, 
            pageTitle: 'All Products', 
            path: '/products'
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatuseCode = 500;
        return next(error); //skip all middleware till error handling middleware
    });   
};

exports.getIndex =(req,res, next) => {
    console.log(req.session.isLoggedIn);
    Product.find()
    .then(products => {
        res.render('shop/index', {
            prods: products, 
            pageTitle: 'Shop', 
            path: '/',
            csrfToken: req.csrfToken()
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatuseCode = 500;
        return next(error); //skip all middleware till error handling middleware
    });
};

exports.getProduct =(req,res, next) => {
    const prodId = req.params.productId
    Product.findById(prodId)
    .then((product) => {
        res.render('shop/product-detail',{
            product: product,
            pageTitle: product.title,
            path: '/products'
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatuseCode = 500;
        return next(error); //skip all middleware till error handling middleware
    });
};

exports.getCheckout =(req,res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    });
};



exports.getCart =(req,res, next) => {
    req.user
    .populate('cart.items.productId')
    .then(user => {
        res.render('shop/cart', {
            products: user.cart.items,
            totalPrice: 0, 
            pageTitle: 'Cart', 
            path: '/cart'
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatuseCode = 500;
        return next(error); //skip all middleware till error handling middleware
    });
};

exports.postCart = (req,res,next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
    .then(product => {
        console.log(product);
        return req.user.addToCart(product);
    })
    .then(result => {
        console.log(result);
        res.redirect('/cart');
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatuseCode = 500;
        return next(error); //skip all middleware till error handling middleware
    });
};

exports.postDeleteCart = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.deleteFromCart(prodId)
    .then(result => {
        res.redirect('/cart');
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatuseCode = 500;
        return next(error); //skip all middleware till error handling middleware
    });
};

exports.postOrder = (req, res, next) => {
    req.user
    .populate('cart.items.productId')
    .then(user => {
        const products = user.cart.items.map(i => {
            return {quantity: i.quantity, product: {...i.productId._doc}};
        });
        const order = new Order({
            user: {
                email: req.user.email,
                userId: req.user
            },
            products: products
            });
            return order.save();
    }).then(result => {
        return req.user.clearCart();
    }).then(() => {
        res.redirect('/orders');
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatuseCode = 500;
        return next(error); //skip all middleware till error handling middleware
    });
};

exports.getOrders =(req,res, next) => {    
    req.user.getOrders()
    .then(orders => {
        res.render('shop/orders', {
            pageTitle: 'Your Orders',
            path: '/orders',
            orders: orders
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatuseCode = 500;
        return next(error); //skip all middleware till error handling middleware
    }); 
};
