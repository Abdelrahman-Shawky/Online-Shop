const Product = require('../models/product');
const Cart = require('../models/cart');


exports.getProducts = (req, res, next) =>{
    Product.findAll()
    .then(products => {
        res.render('shop/product-list', {
            prods: products, 
            pageTitle: 'All Products', 
            path: '/products'
        });
    })
    .catch(err => console.log(err));     
};

exports.getIndex =(req,res, next) => {
    Product.findAll()
    .then(products => {
        res.render('shop/index', {
            prods: products, 
            pageTitle: 'Shop', 
            path: '/'
        });
    })
    .catch(err => console.log(err));
};

exports.getCheckout =(req,res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout',
    });
};

exports.getOrders =(req,res, next) => {
    res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders',
    });
};

exports.getProduct =(req,res, next) => {
    const prodId = req.params.productId
    Product.findByPk(prodId)
    .then((product) => {
        res.render('shop/product-detail',{
            product: product,
            pageTitle: product.title,
            path: '/products'
        });
    })
    .catch(err => console.log(err));

};

exports.getCart =(req,res, next) => {
    req.user.getCart()
    .then(cart => {
        return cart.getProducts()
        .then(products => {
            res.render('shop/cart', {
                prods: products,
                totalPrice: 0, 
                pageTitle: 'Cart', 
                path: '/cart'
            });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));

    // Cart.fetchAll((cart) => {
    //     Product.fetchAll(productDetails => {
    //         res.render('shop/cart', {
    //             prods: cart.products,
    //             productDetails: productDetails,
    //             totalPrice: cart.totalPrice, 
    //             pageTitle: 'Cart', 
    //             path: '/cart'
    //     });
    //     })
    // });
};

exports.postCart = (req,res,next) => {
    const prodId = req.body.productId;

    req.user.getCart()
    .then(cart => {
        
    })
    .catch(err => console.log(err));
    // Product.findbyId(prodId, (product) => {
    //     Cart.addProduct(prodId, product.price);
    // }); 
    // res.redirect('/cart');
};

exports.postDeleteCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findbyId(prodId, (product) => {
        Cart.removeProduct(prodId, product.price);
        res.redirect('/cart');
    }); 
}