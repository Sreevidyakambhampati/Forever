import express from 'express'
import { listProducts, listSellerProducts, addProduct, removeProduct, singleProduct } from '../controllers/productController.js'
import upload from '../middleware/multer.js';
import isAdmin from '../middleware/isAdmin.js';
import hasAccessToAdminPanel from '../middleware/hasAccessToAdminPanel.js';

const productRouter = express.Router();

productRouter.post('/add',hasAccessToAdminPanel,upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1}]),addProduct);
productRouter.post('/remove',hasAccessToAdminPanel,removeProduct);
productRouter.post('/single',singleProduct);
productRouter.get('/list',listProducts);
productRouter.get('/seller/list',listSellerProducts);

export default productRouter