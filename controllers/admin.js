const Product = require('../models/product')

exports.getAddProduct = (req, res, next) =>{
    res.render('admin/add-product', {
        pageTitle: "Add Product", 
        path: '/admin/add-product',
        editing: false
    }); 
};

exports.getEditProduct = (req, res, next) =>{
    const editMode = req.query.edit;
    if(!editMode) {
        res.redirect('/');
    }
    const prodId = req.params.productId;

    Product.findByPk(prodId)
    .then(product => {
        res.render('admin/edit-product', {
            pageTitle: "Edit Product", 
            path: '/admin/edit-product',
            editing: editMode,
            product: product
            }); 
    })
    .catch(err => {
        console.log(err);
        return res.redirect('/');
    });   
};

exports.postAddProduct =  (req,res,next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    Product.create({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description
    })
    .then(result => {
        console.log(res);
        res.redirect('/admin/products');
    })
    .catch(err => console.log(err));    
};

exports.postEditProduct =  (req,res,next) => {
    const prodId = req.body.productId;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    Product.findByPk(prodId)
    .then(product => {
        product.title = title;
        product.imageUrl = imageUrl;
        product.description = description;
        product.price = price;
        return product.save();
    })
    .then(res => {
        console.log('Updated Product !!')
        res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct =  (req,res,next) => {
    const prodId = req.body.productId;
    Product.findByPk(prodId)
    .then(product => {
        return product.destroy();
    })
    .then(result => {
        console.log('Deleted Product !!');
        res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};


exports.getProducts =(req,res, next) => {
    Product.findAll()
    .then(products => {
        res.render('admin/products', {
            prods: products, 
            pageTitle: 'Admin Products', 
            path: '/admin/products'
    });
    })
    .catch(err => console.log(err));
};