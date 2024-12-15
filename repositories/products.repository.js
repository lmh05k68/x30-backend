import ProductModel from "../models/Product.js";
export const getAllProducts = () => ProductModel.find();
export const getProductsByIds = (ids) =>
  ProductModel.find({ _id: { $in: ids } });
export const getProductsByShopId = (shopId) => ProductModel.find(shopId);
export const getOneProduct = (info) => ProductModel.findOne(info);
export const updateProduct = (...args) =>
  ProductModel.findOneAndUpdate(...args);
export const createProduct = (data) => ProductModel.create(data);
