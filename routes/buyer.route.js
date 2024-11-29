import {Router} from 'express'
//import multer from "multer";
import { buyerProfile, buyerUpdateProfile} from "../controllers/buyer.controller.js";
import {validateUpdateBuyerRequest} from '../validations/buyer.validation.js'
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
const BuyerRouter = Router()
BuyerRouter.get('/buyer',buyerProfile)
BuyerRouter.patch('/buyer', validateUpdateBuyerRequest, buyerUpdateProfile)
export default BuyerRouter