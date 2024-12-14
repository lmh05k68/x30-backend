import mongoose from "mongoose";
import collections from "../const/collection.const.js";

// Định nghĩa schema cho đơn hàng
const orderSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "buyers", // Tham chiếu đến bảng buyers (người mua)
    required: true,
  },
  products: [
    {
      productGroupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "productgroups", // Tham chiếu đến bảng productGroups (nhóm sản phẩm)
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  status: {
    type: String,
    enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
    default: "Pending", // Trạng thái đơn hàng mặc định là "Pending"
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now, // Ngày đặt hàng mặc định là thời gian hiện tại
  },
  address: {
    type: String,
    required: true,
  },
  paymentMethods:[
    {
        type: String,
        isDefault: Boolean
    }
]
});
// Tạo model từ schema
const OrderModel = mongoose.model(collections.order, orderSchema);
export default OrderModel;
