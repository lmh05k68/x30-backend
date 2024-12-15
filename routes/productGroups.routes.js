import multer from "multer";
import { Router } from "express";
import {
  createNewProductGroup,
  sellerGetProductGroups,
  sellerGetProductGroupById,
  sellerAddProduct,
  buyerGetProductGroups,
  buyerGetProductGroupById,
} from "../controllers/productGroups.controllers.js";
import sellerAuthMiddleware from "../middlewares/seller.auth.middleware.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const ProductGroupsRouter = Router();

ProductGroupsRouter.get(
  "/seller/products",
  sellerAuthMiddleware.authentication,
  sellerGetProductGroups
);
ProductGroupsRouter.post(
  "/seller/create-productgroup",
  upload.single("file"),
  sellerAuthMiddleware.authentication,
  createNewProductGroup
);
ProductGroupsRouter.get(
  "/seller/productgroup",
  sellerAuthMiddleware.authentication,
  sellerGetProductGroupById
);
ProductGroupsRouter.patch(
  "/seller/add-product",
  sellerAuthMiddleware.authentication,
  sellerAddProduct
);
// ProductGroupsRouter.get("/seller/product", sellerGetOneProduct)

ProductGroupsRouter.get("/buyer/products", buyerGetProductGroups);
ProductGroupsRouter.get("/buyer/productgroup", buyerGetProductGroupById);

export default ProductGroupsRouter;
