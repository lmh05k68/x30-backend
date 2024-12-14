import { Router } from "express";
import {getCart,addToCart,updateQuantity,removeFromCart} from "../controllers/cart.controller.js";
const CartRouter = Router();
// API xem giỏ hàng của buyer
CartRouter.get("/", getCart);
CartRouter.post("/add", addToCart);
CartRouter.put("/update", updateQuantity);
CartRouter.delete('/delete',removeFromCart)
export default CartRouter;