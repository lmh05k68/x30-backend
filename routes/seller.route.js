import {Router} from 'express'
//import multer from "multer";
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
import { sellerProfile, sellerUpdateProfile} from "../controllers/seller.controller.js";
import {validateUpdateSellerRequest} from '../validations/seller.validation.js'
import sellerAuthMiddleware from '../middlewares/seller.auth.middleware.js';
import { createProduct, getProducts, getProductById, updateProduct,createProductGroup, getProductGroups, getProductGroupById, updateProductGroup, sellerForgotPassword,sellerResetPassword,sellerLogin,sellerRegister,logoutSeller} from '../controllers/seller.controller.js'
const SellerRouter = Router()
SellerRouter.get('/sellerProfile', sellerAuthMiddleware.authentication,sellerProfile)
SellerRouter.patch('/sellerProfile', sellerAuthMiddleware.authentication, validateUpdateSellerRequest, sellerUpdateProfile)

SellerRouter.get('/product-groups', sellerAuthMiddleware.authentication,getProductGroups );
SellerRouter.get('/product-groups/:id', sellerAuthMiddleware.authentication, getProductGroupById);
SellerRouter.post('/product-groups', sellerAuthMiddleware.authentication,createProductGroup);
SellerRouter.patch('/product-groups/:id', sellerAuthMiddleware.authentication,updateProductGroup);

SellerRouter.post('/product', sellerAuthMiddleware.authentication,createProduct);
SellerRouter.patch('/product/:id', sellerAuthMiddleware.authentication,updateProduct);
SellerRouter.get('/product', sellerAuthMiddleware.authentication,getProducts);
SellerRouter.get('/product/:id', sellerAuthMiddleware.authentication,getProductById);

SellerRouter.post('/forgot-password',sellerForgotPassword)
SellerRouter.post('/reset-password',sellerResetPassword)

SellerRouter.post('/register',sellerRegister)
SellerRouter.post('/login',sellerLogin)
SellerRouter.post('/logout',logoutSeller)
export default SellerRouter