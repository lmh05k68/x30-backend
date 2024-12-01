import { getProducts, sellerGetOneProduct, sellerGetProducts } from "../controllers/products.controlers.js";
import { Router } from "express";

const ProductRouter = Router();

ProductRouter.get("/", getProducts);
ProductRouter.get("/seller/products", sellerGetProducts)
ProductRouter.get("/:productId", sellerGetOneProduct)
export default ProductRouter;
