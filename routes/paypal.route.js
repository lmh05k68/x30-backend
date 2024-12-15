import { Router } from "express";
import {
  createPayment,
  executePayment,
  cancelPayment,
} from "../controllers/paypal.controller.js";

const PayPalRouter = Router();

PayPalRouter.post("/create", createPayment); // Tạo thanh toán
PayPalRouter.get("/success", executePayment); // Xử lý thành công
PayPalRouter.get("/cancel", cancelPayment); // Hủy thanh toán

export default PayPalRouter;