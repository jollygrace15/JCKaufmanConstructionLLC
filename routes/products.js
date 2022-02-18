const express = require("express");
const router = express.Router(); // #1 - Create a new express Router

const { Product } = require('../models')
//  #2 Add a new route to the Express router

//import in createProductForm and bootstrapField
const {bootstrapField, createProductForm} = require('../forms')


router.get('/products', async function (req,res) {
    let products = await Product.collection().fetch();
    //res.send(products.toJSON());
    res.render('products/index',{
<<<<<<< HEAD
        'products': products.toJSON() // make sure to call .toJSON()
=======
        'products': products
>>>>>>> 0746480567ff840d89e767a709b895df8d019538
    })
})

router.get('/create', (req,res) =>{
    //res.send('Creating a new product')
    const productForm = createProductForm();
    //convert the form to bootstrap design
    res.render('products/create', {
        'form': productForm.toHTML(bootstrapField)
    })
})

router.post('/create', function(req,res){
    //goal: create a new product based on the input in the form
    const productForm = createProductForm();
    productForm.handle(req,{
        'success':async function(form){
            console.log(form.data)
            const newProduct = new Product();
            newProduct.set('name', form.data.name);
            newProduct.set('cost', form.data.cost);
            newProduct.set('description', form.data.description);
            await newProduct.save();
            res.redirect('/products');
        },
        'error':function(form) {
            res.render('products/create',{
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/:product_id/update', async (req, res) => {
    // retrieve the product
    const productId = req.params.product_id
    const product = await Product.where({
        'id': productId
    }).
    fetch({
        require: true
    });

    const productForm = createProductForm();

    // fill in the existing values
    productForm.fields.name.value = product.get('name');
    productForm.fields.cost.value = product.get('cost');
    productForm.fields.description.value = product.get('description');

    res.render('products/update', {
        'form': productForm.toHTML(bootstrapField),
        'product': product.toJSON()
    })

})

module.exports = router; // #3 export out the router