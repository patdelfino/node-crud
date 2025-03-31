var Product = require('../models/Product'); // Updated model name

var productController = {};

productController.list = async function(req, res) {
    try {
        var products = await Product.find({});
        res.render("../views/product/index", { products: products }); // Updated view path
    } catch (error) {
        console.error("Error listing products:", error);
        res.status(500).send("Internal server error");
    }
};

productController.show = async function(req, res) {
    try {
        var product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send("Product not found");
        }
        res.render("../views/product/show", { product: product }); // Updated view path
    } catch (error) {
        console.error("Error showing product:", error);
        res.status(500).send("Internal server error");
    }
};

productController.create = function(req, res) {
    res.render("../views/product/create"); // Updated view path
};

productController.save = async function(req, res) {
    try {
        var product = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
        });
        await product.save();
        console.log("Successfully created a product.");
        res.redirect("/products/show/" + product._id); // Updated redirect
    } catch (error) {
        console.error("Error saving product:", error);
        if (error.name === 'ValidationError') {
            var validationErrors = Object.values(error.errors).map(function(err) { return err.message; });
            return res.status(400).render("../views/product/create", { errors: validationErrors }); // Updated view path
        }
        res.status(500).send("Internal server error");
    }
};

productController.edit = async function(req, res) {
    try {
        var product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send("Product not found");
        }
        res.render("../views/product/edit", { product: product }); // Updated view path
    } catch (error) {
        console.error("Error editing product:", error);
        res.status(500).send("Internal server error");
    }
};

productController.update = async function(req, res) {
    try {
        var product = await Product.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
        }, { new: true });
        if (!product) {
            return res.status(404).send("Product not found");
        }
        res.redirect("/products/show/" + product._id); // Updated redirect
    } catch (error) {
        console.error("Error updating product:", error);
        if (error.name === 'ValidationError') {
            var validationErrors = Object.values(error.errors).map(function(err) { return err.message; });
            return res.status(400).render("../views/product/edit", { product: req.body, errors: validationErrors }); // Updated view path
        }
        res.status(500).send("Internal server error");
    }
};

productController.delete = async function(req, res) {
    try {
        var deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).send("Product not found");
        }
        console.log("Product deleted!");
        res.redirect("/products"); // Updated redirect
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).send("Internal server error");
    }
};

module.exports = productController;