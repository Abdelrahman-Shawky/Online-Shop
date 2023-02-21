const Product = require('../models/product');

exports.getProducts = (req, res, next) =>{
    Product.fetchAll()
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
    Product.fetchAll()
    .then(products => {
        res.render('shop/index', {
            prods: products, 
            pageTitle: 'Shop', 
            path: '/'
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
            path: '/products'
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
    let fetchedCart;
    let newQuantity = 1;

    req.user.getCart()
    .then(cart => {
        fetchedCart = cart;
        return cart.getProducts({where: {id: prodId}});
    })
    .then(products => {
        let product;
        if(products.length > 0){
        product = products[0];
        }
        if (product) {
            const oldQuantity = product.cartItem.quantity;
            newQuantity = oldQuantity + 1
            return product;
        }
        return Product.findByPk(prodId);
    })
    .then(product => {
        return fetchedCart.addProduct(product, {
            through: {quantity: newQuantity }
        })
    })
    .then(() => {
        res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postDeleteCart = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.getCart()
    .then(cart => {
        return cart.getProducts({where: {id: prodId}})
    })
    .then(products => {
        const product = products[0];
        return product.cartItem.destroy();
    })
    .then((result) => {
        res.redirect('/cart')
    })
    .catch(err => console.log(err)); 
};

exports.postOrder = (req, res, next) => {
    let prods;
    let fetchedCart;
    req.user.getCart()
    .then(cart => {
        fetchedCart = cart;
        return cart.getProducts();
    })
    .then(products => {
        prods = products;
        return req.user.createOrder();
    })
    .then((order) => {
        // lsiightly modified elements
        console.log(prods);
        return order.addProducts(prods.map(product => {
            product.orderItem = {quantity: product.cartItem.quantity};
            return product;
        }));
    })
    .then( result => {
        return fetchedCart.setProducts(null);
    })
    .then(result => {
        res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports.getOrders =(req,res, next) => {
    req.user.getOrders({include: ['products']})
    .then(orders => {
        res.render('shop/orders', {
            pageTitle: 'Your Orders',
            path: '/orders',
            orders: orders
        });
    })
    .catch(err => console.log(err));
    
};
