import mongoose from 'mongoose';
import collections from '../const/collection.const.js'
const orderSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref:collections.buyers, required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref:collections.products, required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      discount: { type: Number, required: true },
      totalPrice: { type: Number, required: true }, // Tính giá trị sau khi giảm giá
    },
  ],
  totalAmount: { type: Number, required: true }, // Tổng số tiền của đơn hàng
  status: { type: String, default: 'Pending' }, // Trạng thái đơn hàng (Pending, Completed, Cancelled)
  createdAt: { type: Date, default: Date.now },
});

const OrderModel = mongoose.model(collections.order, orderSchema);
export default OrderModel;
