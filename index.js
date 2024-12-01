import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import {buyerValidateRegisterRequest,buyerValidateLoginRequest} from './validations/buyer.validation.js'
import {sellerValidateRegisterRequest,sellerValidateLoginRequest} from './validations/seller.validation.js'
import {buyerRegister,buyerLogin} from './controllers/buyer.controller.js'
import {sellerRegister, sellerLogin} from './controllers/seller.controller.js'
import buyerAuthMiddleware from './middlewares/buyer.auth.middlewares.js'
import sellerAuthMiddleware from './middlewares/seller.auth.middleware.js'
import BuyerRouter from './routes/buyer.route.js'
import SellerRouter from './routes/seller.route.js'
import ProductRouter from "./routes/products.routes.js"
import ProductGroupsRouter from "./routes/productGroups.routes.js"
import localizationMiddleware from './middlewares/localization.auth.middleware.js'
dotenv.config()

await mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("database connected!"))
const PORT = process.env.PORT_LOCAL || 8080
const app = express()
app.use(express.json())
app.use(cors())
app.use(localizationMiddleware.applyLocalization)
app.post("/api/v1/buyerRegister",buyerValidateRegisterRequest, buyerRegister)
app.post("/api/v1/buyerLogin",buyerValidateLoginRequest, buyerLogin)

app.post("/api/v1/sellerRegister",sellerValidateRegisterRequest, sellerRegister)
app.post("/api/v1/sellerLogin",sellerValidateLoginRequest, sellerLogin)

// app.use(buyerAuthMiddleware.authentication)
// app.use(sellerAuthMiddleware.authentication)

app.use("/api/v1", BuyerRouter)
app.use("/api/v1", SellerRouter)

app.use("/api/v1/products", ProductRouter);
app.use("/api/v1/productgroups", ProductGroupsRouter)

app.listen(PORT, (err) => {
    if(err) throw new Error(err)
    console.log(`Server is running PORT: ${PORT}`)
})