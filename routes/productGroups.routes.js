import { Router } from "express";
import { createNewProductGroup, sellerGetProductGroups, sellerGetProductGroupById } from "../controllers/productGroups.controllers.js";
import sellerAuthMiddleware from "../middlewares/seller.auth.middleware.js";


const ProductGroupsRouter = Router();

ProductGroupsRouter.get("/seller/products", sellerAuthMiddleware.authentication, sellerGetProductGroups);
ProductGroupsRouter.post("/seller/products", sellerAuthMiddleware.authentication, createNewProductGroup);
ProductGroupsRouter.get("/seller/productgroup", sellerAuthMiddleware.authentication, sellerGetProductGroupById);
// ProductGroupsRouter.get("/seller/product", sellerGetOneProduct)

export default ProductGroupsRouter;