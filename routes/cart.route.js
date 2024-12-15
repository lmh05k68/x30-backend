import { Router } from "express";
import {getCart,addToCart,updateQuantity,removeFromCart} from "../controllers/cart.controller.js";
import {placeOrder} from '../controllers/order.controller.js'
const CartRouter = Router();
// API xem giỏ hàng của buyer
CartRouter.get("/", getCart);
CartRouter.post("/add", addToCart);
CartRouter.put("/update", updateQuantity);
CartRouter.delete('/delete',removeFromCart)
CartRouter.post('/order',placeOrder)
export default CartRouter;