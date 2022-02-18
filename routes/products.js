const express = require("express");
const router = express.Router(); // #1 - Create a new express Router

const { Product } = require('../models')
//  #2 Add a new route to the Express router

//import in createProductForm and bootstrapField
const {bootstrapField, createProductForm} = require('../forms');

//create a function that will get an info of a particular product ID
//async function getProductById(productId) {
//    const product =  await Product.where({
//        'id': productId
//    }).fetch({
//        'require':true
//    })
    //return product
//}
//working
router.get('/products', async function (req,res) {
    let products = await Product.collection().fetch();
    //res.send(products.toJSON());
    res.render('products/index',{
        'products': products.toJSON() // make sure to call .toJSON()
    })
})
//working
router.get('/create', (req,res) =>{
    //res.send('Creating a new product')
    const productForm = createProductForm();
    //convert the form to bootstrap design
    res.render('products/create', {
        'form': productForm.toHTML(bootstrapField)
    })
})
//working
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

//router.get('/:product_id/update', async function(req, res){
    // retrieve the product
  //  const productId = req.params.product_id;
    //const product = await Product.where({
    //    'id': productId
    //}).fetch({
    //    'require': true
    //})
    //const product = getProductById(productId)
    //const productForm = createProductForm();
    //res.send(product.toJSON());
    // fill in the existing values
    //productForm.fields.name.value = product.get('name');
    //productForm.fields.cost.value = product.get('cost');
    //productForm.fields.description.value = product.get('description');

    //res.render('products/update', {
    //    'form': productForm.toHTML(bootstrapField),
    //    'product': product.toJSON()
    //})
//})


router.post('/:product_id/update', async (req, res) => {

    // fetch the product that we want to update
    //const product = await Product.where({
    //    'id': req.params.product_id
    //}).fetch({
    //    require: true
    //});

    const product = getProductById(productId)

    // process the form
    const productForm = createProductForm();
    productForm.handle(req, {
        'success': async (form) => {
            product.set(form.data);
            product.save();
            res.redirect('/products');
        },
        'error': async (form) => {
            res.render('products/update', {
                'form': form.toHTML(bootstrapField),
                'product': product.toJSON()
            })
        }
    })
})


router.get('/:product_id/delete', async function(req, res){
    const product = await getProductById(productId)
    res.render('products/delete',{
        'product': product.toJSON()
    })
})

router.post('/:product_id/delete', async function(req,res){
    const product = await getProductById(req.params.product_id)
    await product.destroy();
    res.redirect('/products');
})
module.exports = router; // #3 export out the router