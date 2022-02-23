const express = require("express");
const router = express.Router(); // #1 - Create a new express Router
//One model, (product, category), reperesents one table in the database
const { Product, Category, Tag } = require('../models');

//  #2 Add a new route to the Express router

//import in createProductForm and bootstrapField
const {bootstrapField, createProductForm} = require('../forms');

//create a function that will get an info of a particular product ID
async function getProductById(productId) {
    const product = await Product.where({
        'id': productId
    }).fetch({
        'require':false,
        withRelated:['tags'] // fetch all the tags associated with the product
    });
    return product;
}

//working
router.get('/products', async function (req,res) {
    let products = await Product.collection().fetch({
        withRelated:['category']
    });
    //res.send(products.toJSON());
    res.render('products/index',{
        'products': products.toJSON() // make sure to call .toJSON()
    })
})
//working
router.get('/create', async function (req,res) {
    //res.send('Creating a new product')
    //let choices = [
    //    [1, "Snacks"],
    //    [2, "Juices"],
    //    [3, "Ulam"],
    //    [4, "Dessert"]
    //]
    const choices = await Category.fetchAll().map(function(category){
        return [ category.get('id'), category.get('name')]
    })
    const allTags = await Tag.fetchAll().map(function(tag){
        return [ tag.get('id'), tag.get('name')]
    })
    const productForm = createProductForm(choices, allTags);
    //convert the form to bootstrap design
    res.render('products/create', {
        'form': productForm.toHTML(bootstrapField)
    })
})
//working
router.post('/create', async (req, res) => {
    const productForm = createProductForm();
    productForm.handle(req, {
        'success': async (form) => {
            // separate out tags from the other product data
            // as not to cause an error when we create
            let {tags, ...productData} = form.data;
            const product = new Product(productData);
            await product.save();
            // save the many to many relationship
            if (tags) {
                await product.tags().attach(tags.split(","));
            }


            res.redirect('/products');
        },
        'error': async (form) => {
            res.render('products/create', {
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
    // fetch all the categories
    const choices = await Category.fetchAll().map(function(category){
        return [ category.get('id'), category.get('name')]
    })
    const allTags = await Tag.fetchAll().map(function(tag){
        return [ tag.get('id'), tag.get('name')]
    })
    console.log(choices + "update");
    const productForm = createProductForm(choices, allTags);
    //res.send("Editing " + productId)
    //res.send(product.toJSON());
    // fill in the existing values
    productForm.fields.name.value = product.get('name');
    productForm.fields.cost.value = product.get('cost');
    productForm.fields.description.value = product.get('description');
    productForm.fields.category_id.value = product.get('category_id');

    // get only the ids from the tags that belongs to the product
   const selectedTags = await product.related('tags').pluck('id');
   // set the existing tags
   productForm.fields.tags.value = selectedTags;

    res.render('products/update', {
        'form': productForm.toHTML(bootstrapField),
        'product': product.toJSON()
    })
})



router.post('/products/:product_id/update', async function(req,res){
    //res.send("Please wait")  
    // fetch all the categories
    const choices = await Category.fetchAll().map(function(category){
        return [ category.get('id'), category.get('name')]
    })
    const allTags = await Tag.fetchAll().map(function(tag){
        return [ tag.get('id'), tag.get('name')]
    })
    console.log(allTags + "update");
    const productForm = createProductForm(choices, allTags);

    // fetch the instance of the product that we wish to update
    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        require: false, // was true pero sa turo ay false
        withRelated:['tags']    
    })

     //pass the request into the product form
    productForm.handle(req, {
        'success':async function(form){
            //product.set(form.data);
            // executes if the form data is all valid
            //product.set('name', form.data.name);
            //product.set('cost', form.data.cost);
            //product.set('description', form.data.description)
            //product.set('category_id', form.data.category_id)
            // if ALL the names of the fields matches
            // the column names in the table, we can use the following shortcut
            //product.set(form.data);

            // use object destructuring to extract the tags key from `form.data`
            // into the `tags` variable,
            // and all the remaining keys will go into `productData`
            let {tags, ...productData} = form.data;

            product.set(productData);
            await product.save();

            let tagIds = tags.split(','); // change for example '1,2,3' into [1,2,3]

            // get all the existing tags inside the product
            let existingTagIds = await product.related('tags').pluck('id');
            //console.log("existingTagIds=",existingTagIds);
            // find all the tags to remove
            let toRemove = existingTagIds.filter( function(id){
                return tagIds.includes(id) === false;
            });
            //console.log("toremove=", toRemove);
            await product.tags().detach(toRemove);
            await product.tags().attach(tagIds)
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