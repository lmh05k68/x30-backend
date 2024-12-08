import express from "express";
import {getCart} from "../controllers/cart.controller.js";
const CartRouter = Router();
// API xem giỏ hàng của buyer
CartRouter.get("/cart", getCart);
export default CartRouter;