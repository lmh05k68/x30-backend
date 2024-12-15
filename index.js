import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import {buyerValidateRegisterRequest,buyerValidateLoginRequest} from './validations/buyer.validation.js'
import {sellerValidateRegisterRequest,sellerValidateLoginRequest} from './validations/seller.validation.js'
import {adminValidateRegisterRequest,adminValidateLoginRequest} from './validations/admin.validation.js'
import {adminRegister,adminLogin} from './controllers/admin.controller.js'
import {buyerRegister,buyerLogin} from './controllers/buyer.controller.js'
import {sellerRegister, sellerLogin} from './controllers/seller.controller.js'
import BuyerRouter from './routes/buyer.route.js'
import SellerRouter from './routes/seller.route.js'
import AdminRouter from './routes/admin.route.js'
import localizationMiddleware from './middlewares/localization.auth.middleware.js'
import ProductRouter from "./routes/products.routes.js"
import ProductGroupsRouter from "./routes/productGroups.routes.js"
import CategoryRouter from "./routes/category.route.js"
import PayPalRouter from "./routes/paypal.route.js";
dotenv.config()

await mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("database connected!"))
const PORT = process.env.PORT_LOCAL || 8000
const app = express()
app.use(express.json())
app.use(cors())
app.use(localizationMiddleware.applyLocalization)
app.post("/api/v1/buyerRegister",buyerValidateRegisterRequest, buyerRegister)
app.post("/api/v1/buyerLogin",buyerValidateLoginRequest, buyerLogin)

app.post("/api/v1/sellerRegister",sellerValidateRegisterRequest, sellerRegister)
app.post("/api/v1/sellerLogin",sellerValidateLoginRequest, sellerLogin)

app.post("/api/v1/adminRegister",adminValidateRegisterRequest,adminRegister)
app.post("/api/v1/adminLogin",adminValidateLoginRequest,adminLogin)

app.use("/api/v1/buyer", BuyerRouter)
app.use("/api/v1/seller", SellerRouter)
app.use("/api/v1/admin",AdminRouter)

app.use("/api/v1/products", ProductRouter);
app.use("/api/v1/productgroups", ProductGroupsRouter)

app.use("/api/v1/category", CategoryRouter);

app.use("/api/v1/paypal", PayPalRouter);

app.listen(PORT, (err) => {
    if(err) throw new Error(err)
    console.log(`Server is running PORT: ${PORT}`)
})