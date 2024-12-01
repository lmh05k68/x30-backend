import {Router} from 'express'
//import multer from "multer";
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
import { sellerProfile, sellerUpdateProfile} from "../controllers/seller.controller.js";
import {validateUpdateSellerRequest} from '../validations/seller.validation.js'
import sellerAuthMiddleware from '../middlewares/seller.auth.middleware.js';
const SellerRouter = Router()
SellerRouter.get('/sellerProfile', sellerAuthMiddleware.authentication,sellerProfile)
SellerRouter.patch('/sellerProfile', sellerAuthMiddleware.authentication, validateUpdateSellerRequest, sellerUpdateProfile)
export default SellerRouter