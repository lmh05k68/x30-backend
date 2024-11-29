import {Router} from 'express'
//import multer from "multer";
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
import { sellerProfile, sellerUpdateProfile} from "../controllers/seller.controller.js";
import {validateUpdateSellerRequest} from '../validations/seller.validation.js'
const SellerRouter = Router()
SellerRouter.get('/seller',sellerProfile)
SellerRouter.patch('/seller', validateUpdateSellerRequest, sellerUpdateProfile)
export default SellerRouter