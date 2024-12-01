import ProductModel from "../models/Product.js";

export const getAllProducts = () => ProductModel.find();
export const getProductsByShopId = (shopId) => ProductModel.find(shopId);
export const getOneProduct = (info) => ProductModel.findOne(info);
