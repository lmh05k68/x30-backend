import { Router } from "express";
//import multer from "multer";
import {
  buyerProfile,
  buyerUpdateProfile,
} from "../controllers/buyer.controller.js";
import { validateUpdateBuyerRequest } from "../validations/buyer.validation.js";
import buyerAuthMiddleware from "../middlewares/buyer.auth.middlewares.js";
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
const BuyerRouter = Router();
BuyerRouter.get("/buyerProfile", buyerAuthMiddleware.authentication, buyerProfile);
BuyerRouter.patch(
  "/buyerProfile",
  buyerAuthMiddleware.authentication,
  validateUpdateBuyerRequest,
  buyerUpdateProfile
);
export default BuyerRouter;
