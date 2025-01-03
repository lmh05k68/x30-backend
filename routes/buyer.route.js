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
import {getCart,addToCart,updateQuantity,removeFromCart} from "../controllers/cart.controller.js";
import {placeOrder, getOrders} from '../controllers/order.controller.js'
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
import { buyerForgotPassword, buyerResetPassword,buyerLogin,buyerRegister,logoutBuyer } from "../controllers/buyer.controller.js";
const BuyerRouter = Router();
BuyerRouter.post('/login',buyerLogin)
BuyerRouter.post('/register',buyerRegister)
BuyerRouter.post('/logout',logoutBuyer)
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
BuyerRouter.get("/product-groups", getProductGroups);
BuyerRouter.get("/product-groups/:id", getProductGroup);
BuyerRouter.get("/get-cart", getCart);
BuyerRouter.post("/add-cart", addToCart);
BuyerRouter.delete('/delete-cart',removeFromCart)
BuyerRouter.put('/update-quantity',updateQuantity)
BuyerRouter.post('/order',placeOrder)
BuyerRouter.get('/get-order',getOrders)
BuyerRouter.post('/forgot-password',buyerForgotPassword)
BuyerRouter.post('/reset-password',buyerResetPassword )
export default BuyerRouter;