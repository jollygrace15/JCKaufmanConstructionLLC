const express = require("express");
const router = express.Router(); // #1 - Create a new express Router

const { Product } = require('../models')
//  #2 Add a new route to the Express router

router.get('/products', async function (req,res) {
    let products = await Product.collection().fetch();
    //res.send(products.toJSON());
    res.render('products/index',{
        'products': products
    })
})

router.get('/create', (req,res) =>{
    res.send('Creating a new product')
})

module.exports = router; // #3 export out the router