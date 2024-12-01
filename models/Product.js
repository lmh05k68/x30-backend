import mongoose from "mongoose";
import collections from "../const/collection.const.js"

const productsSchema = new mongoose.Schema({
  discount: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  inStock: { type: Number, required: true },
  price: { type: Number, required: true },
  createAt: { type: Date, default: Date.now(), required: true },
  properties: { type: Object, required: true },
  totalSold: { type: Number, required: true },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  averageRate: { type: Number, default: 0 },
});

const ProductModel = mongoose.model(collections.products, productsSchema);

export default ProductModel;
