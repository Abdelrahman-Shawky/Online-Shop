const Product = require('../models/product')
const {validationResult} = require('express-validator/check');


exports.getProducts =(req,res, next) => {
    Product.find({
        userId: req.user._id
    })
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(products => {
        console.log(products);
        res.render('admin/products', {
            prods: products, 
            pageTitle: 'Admin Products', 
            path: '/admin/products'
    });
    })
    .catch(err => console.log(err));
};

exports.getAddProduct = (req, res, next) =>{
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    res.render('admin/add-product', {
        pageTitle: "Add Product", 
        path: '/admin/add-product',
        editing: false,
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: []
    }); 
};

exports.postAddProduct =  (req,res,next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('admin/add-product', {
          pageTitle: 'Add Product',
          path: '/admin/add-product',
          editing: false,
          hasError: true,
          product: {
            title: title,
            imageUrl: imageUrl,
            price: price,
            description: description
          },
          errorMessage: errors.array()[0].msg,
          validationErrors: errors.array()
        });
      }

    const product = new Product({
        title: title,
        price: price,
        description:  description,
        imageUrl: imageUrl,
        userId: req.user
    });
    product.save()
    .then(result => {
        console.log("Created Product !!")
        res.redirect('/admin/products');
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatuseCode = 500;
        return next(error); //skip all middleware till error handling middleware
    });    
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
            product: product,
            hasError: false,
            errorMessage: null,
            validationErrors: []
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
          pageTitle: 'Edit Product',
          path: '/admin/edit-product',
          editing: true,
          hasError: true,
          product: {
            title: title,
            imageUrl: imageUrl,
            price: price,
            description: desc,
            _id: prodId
          },
          errorMessage: errors.array()[0].msg,
          validationErrors: errors.array()
        });
      }
    
    // const product = new Product(title, price, description, imageUrl, prodId);
    Product.findById(prodId)
    .then(product => {
        if(product.userId.toString() !== req.user._id.toString()){
            return res.redirect('')
        }
        product.title = title;
        product.price = price;
        product.description = description;
        product.imageUrl = imageUrl;
        return product.save().then(result => {
            console.log('Updated Product !!')
            res.redirect('/admin/products');
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatuseCode = 500;
        return next(error); //skip all middleware till error handling middleware
    });
};

exports.deleteProduct =  (req,res,next) => {
    const prodId = req.param.productId;
    // Product.findByIdAndRemove(prodId)
    Product.deleteOne({
        _id: prodId, 
        userId: req.user._id
    })
    .then(() => {
        console.log('Deleted Product !!');
        res.status(200).json({
            message: 'Success!'
        });
        // res.redirect('/admin/products');
    })
    .catch(err => {
        res.status(500).json({
            message: 'Deleting Failed !!'
        });
    });
};


