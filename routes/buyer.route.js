import { Router } from "express";
//import multer from "multer";
import {
  buyerProfile,
  buyerUpdateProfile,
  getProductGroups,
  getProductGroup,
} from "../controllers/buyer.controller.js";
import { validateUpdateBuyerRequest } from "../validations/buyer.validation.js";
import buyerAuthMiddleware from "../middlewares/buyer.auth.middlewares.js";
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
const BuyerRouter = Router();

BuyerRouter.get(
  "/buyerProfile",
  buyerAuthMiddleware.authentication,
  buyerProfile
);

BuyerRouter.patch(
  "/buyerProfile",
  buyerAuthMiddleware.authentication,
  validateUpdateBuyerRequest,
  buyerUpdateProfile
);

BuyerRouter.get(
  "/product-groups",
  buyerAuthMiddleware.authentication,
  getProductGroups
);

BuyerRouter.get(
  "/product-groups/:id",
  buyerAuthMiddleware.authentication,
  getProductGroup
);

export default BuyerRouter;
