var express = require('express');
var router = express.Router();
var productController = require('../controllers/productController'); // Updated controller name

router.get('/', productController.list);
router.get('/show/:id', productController.show);
router.get('/create', productController.create);
router.post('/save', productController.save);
router.get('/edit/:id', productController.edit);
router.post('/update/:id', productController.update);
router.get('/delete/:id', productController.delete);

module.exports = router;