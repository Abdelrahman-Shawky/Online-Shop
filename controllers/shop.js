const Product = require('../models/product');
const Cart = require('../models/cart');


exports.getProducts = (req, res, next) =>{
    Product.fetchAll()
    .then(([rows, fieldData]) => {
        res.render('shop/product-list', {
            prods: rows, 
            pageTitle: 'All Products', 
            path: '/products'
        });
    })
    .catch(err => console.log(err)); 
     
};

exports.getIndex =(req,res, next) => {
    Product.fetchAll()
    .then(([rows, fieldData]) => {
        res.render('shop/index', {
            prods: rows, 
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
    Product.findbyId(prodId)
    .then(([product]) => {
        res.render('shop/product-detail',{
            product: product[0],
            pageTitle: product[0].title,
            path: '/products'
        });
    })
    .catch(err => console.log(err));
};

exports.getCart =(req,res, next) => {
    Cart.fetchAll((cart) => {
        Product.fetchAll(productDetails => {
            res.render('shop/cart', {
                prods: cart.products,
                productDetails: productDetails,
                totalPrice: cart.totalPrice, 
                pageTitle: 'Cart', 
                path: '/cart'
        });
        })
    });
};

exports.getCart = (req, res, next) => {
    Cart.fetchAll(cart => {
      Product.fetchAll(products => {
        const cartProducts = [];
        for (product of products) {
            const cartProductData = cart.products.find(
            prod => prod.id === product.id
            );
            if (cartProductData) {
                cartProducts.push({ productData: product, qty: cartProductData.qty });
            }
        }
        res.render('shop/cart', {
          path: '/cart',
          pageTitle: 'Your Cart',
          prods: cartProducts,
          totalPrice: cart.totalPrice
        });
      });
    });
};

exports.postCart = (req,res,next) => {
    const prodId = req.body.productId;
    Product.findbyId(prodId, (product) => {
        Cart.addProduct(prodId, product.price);
    }); 
    res.redirect('/cart');
};

exports.postDeleteCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findbyId(prodId, (product) => {
        Cart.removeProduct(prodId, product.price);
        res.redirect('/cart');
    }); 
}