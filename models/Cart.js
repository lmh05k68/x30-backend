import mongoose from "mongoose";
import collections from "../const/collection.const.js";

const CartSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: collections.buyers },
  productGroupId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: collections.productGroups },
  quantity: { type: Number, default: 1 }, // Số lượng mặc định là 1
});
const CartModel = mongoose.model(collections.cart, CartSchema);

export default CartModel;
