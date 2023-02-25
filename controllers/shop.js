const Product = require('../models/product');
const mongoose = require('mongoose');
const Order = require('../models/order');


exports.getProducts = (req, res, next) =>{
    Product.find()
    .then(products => {
        res.render('shop/product-list', {
            prods: products, 
            pageTitle: 'All Products', 
            path: '/products',
            isAthenticated: req.isLoggedIn
        });
    })
    .catch(err => console.log(err));     
};

exports.getIndex =(req,res, next) => {
    Product.find()
    .then(products => {
        res.render('shop/index', {
            prods: products, 
            pageTitle: 'Shop', 
            path: '/',
            isAthenticated: req.isLoggedIn
        });
    })
    .catch(err => console.log(err));
};

exports.getProduct =(req,res, next) => {
    const prodId = req.params.productId
    Product.findById(prodId)
    .then((product) => {
        res.render('shop/product-detail',{
            product: product,
            pageTitle: product.title,
            path: '/products',
            isAthenticated: req.isLoggedIn
        });
    })
    .catch(err => console.log(err));
};

exports.getCheckout =(req,res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout',
        isAthenticated: req.isLoggedIn
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
            path: '/cart',
            isAthenticated: req.isLoggedIn
        });
})
    .catch(err => console.log(err));
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
    });
};

exports.postDeleteCart = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.deleteFromCart(prodId)
    .then(result => {
        res.redirect('/cart');
    })
    .catch(err => console.log(err));
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
                name: req.user.name,
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
    .catch(err => console.log(err));
};

exports.getOrders =(req,res, next) => {    
    req.user.getOrders()
    .then(orders => {
        res.render('shop/orders', {
            pageTitle: 'Your Orders',
            path: '/orders',
            orders: orders,
            isAthenticated: req.isLoggedIn
        });
    })
    .catch(err => console.log(err)); 
};
