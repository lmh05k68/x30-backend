import mongoose from "mongoose";
import collections from "../const/collection.const.js";

const productsSchema = new mongoose.Schema({
  discount: { type: String, default: 0},
  name: { type: String, required: true },
  image: { type: String},
  inStock: { type: Number},
  price: { type: Number},
  createAt: { type: Date, default: Date.now(), required: true },
  properties: { type: Object},
  totalSold: { type: Number, default: 0},
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  averageRate: { type: Number, default: 0 },
  pricePerUnit: { type: Number},
  importedQuantity: { type: Number},
}, {timestamps: true});

const ProductModel = mongoose.model(collections.products, productsSchema);

export default ProductModel;
