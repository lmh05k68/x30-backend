import { Router } from "express";
import {getCart,addToCart,updateQuantity,removeFromCart} from "../controllers/cart.controller.js";
const CartRouter = Router();
// API xem giỏ hàng của buyer
CartRouter.get("/cart", getCart);
CartRouter.post("/cart/add", addToCart);
CartRouter.put("/cart/update", updateQuantity);
CartRouter.delete('/cart/delete',removeFromCart)
export default CartRouter;