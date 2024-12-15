//import ProductModel from "../models/Product.js";
import CartModel from "../models/Cart.js";
import OrderModel from "../models/Order.js";
import BuyerModel from "../models/Buyer.js";

// API Đặt hàng từ giỏ
const placeOrder = async (req, res) => {
  try {
    const { buyerId } = req.body;

    if (!buyerId) {
      return res.status(400).json({ error: "BuyerId is required" });
    }

    // Kiểm tra người mua
    const buyer = await BuyerModel.findById(buyerId);
    if (!buyer) {
      return res.status(404).json({ error: "Buyer not found" });
    }

    // Lấy các sản phẩm trong giỏ hàng
    const cartItems = await CartModel.find({ buyerId }).populate("productId", "name price discount inStock");

    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Tạo đơn hàng từ giỏ hàng
    let totalAmount = 0;
    const products = cartItems.map((item) => {
      const product = item.productId;
      const totalPrice = (product.price - product.discount) * item.quantity;
      totalAmount += totalPrice;

      return {
        productId: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        discount: product.discount,
        totalPrice,
      };
    });

    // Tạo đơn hàng mới
    const newOrder = new OrderModel({
      buyerId,
      products,
      totalAmount,
    });

    // Lưu đơn hàng
    await newOrder.save();

    // Xóa sản phẩm khỏi giỏ hàng sau khi đặt hàng thành công
    await CartModel.deleteMany({ buyerId });

    res.status(200).json({
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { placeOrder };