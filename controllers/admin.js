const Product = require('../models/product')
const mongodb = require('mongodb');

exports.getProducts =(req,res, next) => {
    Product.fetchAll()
    .then(products => {
        res.render('admin/products', {
            prods: products, 
            pageTitle: 'Admin Products', 
            path: '/admin/products'
    });
    })
    .catch(err => console.log(err));
};

exports.getAddProduct = (req, res, next) =>{
    res.render('admin/add-product', {
        pageTitle: "Add Product", 
        path: '/admin/add-product',
        editing: false
    }); 
};

exports.postAddProduct =  (req,res,next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(title, price, description, imageUrl);
    product.save()
    .then(result => {
        res.redirect('/admin/products');
    })
    .catch(err => console.log(err));    
};

exports.getEditProduct = (req, res, next) =>{
    const editMode = req.query.edit;
    if(!editMode) {
        res.redirect('/');
    }
    const prodId = req.params.productId;

    Product.findById(prodId)
    .then(product => {
        if(!product)
        {
            res.redirect('/');
        }
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

exports.postEditProduct =  (req,res,next) => {
    const prodId = req.body.productId;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(title, price, description, imageUrl, new mongodb.ObjectId(prodId));
    product.save().then(result => {
        console.log('Updated Product !!')
        res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

// exports.postDeleteProduct =  (req,res,next) => {
//     const prodId = req.body.productId;
//     Product.findByPk(prodId)
//     .then(product => {
//         return product.destroy();
//     })
//     .then(result => {
//         console.log('Deleted Product !!');
//         res.redirect('/admin/products');
//     })
//     .catch(err => console.log(err));
// };


