import mongoose from "mongoose";
import collections from "../const/collection.const.js";

const productGroupSchema = new mongoose.Schema({
  averageRate: { type: Number },
  brand: { type: String },
  description: { type: String },
  image: { type: [String], default: [] }, // Thay String thành [String]
  title: { type: String },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "shops", // Tham chiếu đến bảng shops
  },
  productIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
    },
  ],
  categoryIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
    },
  ],
});

const ProductGroupModel = mongoose.model(
  collections.productGroups,
  productGroupSchema
);

export default ProductGroupModel;