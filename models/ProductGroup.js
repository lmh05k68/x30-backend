import mongoose from "mongoose";
import collections from "../const/collection.const.js";
const productGroupSchema = new mongoose.Schema({
  averageRate: { type: Number },
  brand: { type: String },
  description: { type: String },
  image: { type: String },
  title: { type: String },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "shops", // Nếu shopId tham chiếu đến bảng shops
  },
  productIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  categoryIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
});
const ProductGroupModel = mongoose.model(
  collections.productGroups,
  productGroupSchema
);
export default ProductGroupModel;