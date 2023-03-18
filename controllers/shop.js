const Product = require('../models/product');
const mongoose = require('mongoose');
const Order = require('../models/order');
const ITEMS_PER_PAGE = 4;


exports.getProducts = (req, res, next) =>{
    const page = +req.query.page || 1;
    let totalItems;
    Product.find().countDocuments()
    .then(numberProducts => {
        totalItems = numberProducts
        return Product.find()
        .skip((page-1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
    })
    .then(products => {
        console.log(products);
        res.render('shop/product-list', {
            prods: products, 
            pageTitle: 'All Products', 
            path: '/products',
            csrfToken: req.csrfToken(),
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatuseCode = 500;
        return next(error); //skip all middleware till error handling middleware
    });   
};

exports.getIndex =(req,res, next) => {
    const page = +req.query.page || 1;
    let totalItems;
    Product.find().countDocuments()
    .then(numberProducts => {
        totalItems = numberProducts
        return Product.find()
        .skip((page-1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
    })
    .then(products => {
        console.log(products);
        res.render('shop/index', {
            prods: products, 
            pageTitle: 'Shop', 
            path: '/',
            csrfToken: req.csrfToken(),
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        });
    })
    .catch(err => {
        console.log(err)
        // const error = new Error(err);
        // error.httpStatuseCode = 500;
        // return next(error); //skip all middleware till error handling middleware
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
    req.user
    .populate('cart.items.productId')
    .then(user => {
        const products = user.cart.items;
        let total = 0;
        products.forEach(p => {
            total += p.quantity * p.productId.price;
        })
        res.render('shop/checkout', {
            products: user.cart.items,
            pageTitle: 'Checkout', 
            path: '/checkout',
            totalSum: total
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatuseCode = 500;
        return next(error); //skip all middleware till error handling middleware
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
