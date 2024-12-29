import multer from "multer";
import { Router } from "express";
import { getProducts, sellerCreateProduct, sellerGetOneProduct, sellerGetProducts, sellerUpdateProduct } from "../controllers/products.controlers.js";
import sellerAuthMiddleware from "../middlewares/seller.auth.middleware.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const ProductRouter = Router();

ProductRouter.get("/", getProducts);
ProductRouter.get("/seller/products", sellerGetProducts)
ProductRouter.get("/:productId", sellerGetOneProduct)
ProductRouter.patch("/seller_update/:productId", upload.single("file"),sellerAuthMiddleware.authentication, sellerUpdateProduct)
ProductRouter.post("/seller-create", upload.single("file"),sellerAuthMiddleware.authentication, sellerCreateProduct)
export default ProductRouter;
