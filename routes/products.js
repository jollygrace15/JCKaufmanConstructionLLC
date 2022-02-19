const express = require("express");
const router = express.Router(); // #1 - Create a new express Router

const { Product } = require('../models')
//  #2 Add a new route to the Express router

//import in createProductForm and bootstrapField
const {bootstrapField, createProductForm} = require('../forms');

//create a function that will get an info of a particular product ID
async function getProductById(productId) {
    const product =  await Product.where({
        'id': productId
    }).fetch({
        'require':true
    })
    return product
};

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


router.get('/products/:product_id/update', async function(req, res){
    //retrieve the product
    const productId = req.params.product_id;
    const product = await Product.where({
        'id': productId
    }).fetch({
        'require': true
    })
    //const product = getProductById(productId)
    const productForm = createProductForm();
    //res.send("Editing " + productId)
    //res.send(product.toJSON());
    // fill in the existing values
    productForm.fields.name.value = product.get('name');
    productForm.fields.cost.value = product.get('cost');
    productForm.fields.description.value = product.get('description');
 
    res.render('products/update', {
        'form': productForm.toHTML(bootstrapField),
        'product': product.toJSON()
   
    })
})



router.post('/products/:product_id/update', async function(req,res){
    //res.send("Please wait")  
    //const productId = req.params.product_id;
    // fetch the instance of the product that we wish to update
    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({ 
        require: true
    })
     //create the product form
    const productForm = createProductForm();
     //pass the request into the product form
    productForm.handle(req, {
        'success':async function(form){
            // executes if the form data is all valid
             product.set('name', form.data.name);
             product.set('cost', form.data.cost);
             product.set('description', form.data.description)
            // if ALL the names of the fields matches
            // the column names in the table, we can use the following shortcut
            //product.set(form.data);
            await product.save();
            res.redirect('/products');
        },
        'error':function(form) {
            // executes if the form data contains
            // invalid entries
            res.render('products/update', {
                'form': form.toHTML(bootstrapField),
                'product': product.toJSON()
            })
        }
    })
})


router.get('/products/:product_id/delete', async function(req,res){
    //const product = await getProductById(productId)
    // fetch the product that we want to delete
    const product = await Product.where({
    'id': req.params.product_id
    }).fetch({
    require: true
    });
    res.render('products/delete',{
        'product': product.toJSON()
    })
})




router.post('/products/:product_id/delete', async function(req,res){
    const product = await getProductById(req.params.product_id)
    await product.destroy();
    res.redirect('/products');
})
module.exports = router;
