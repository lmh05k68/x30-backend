import ProductModel from "../models/Product.js";
import CartModel from "../models/Cart.js";
import BuyerModel from "../models/Buyer.js";
// Controller: Lấy thông tin giỏ hàng
const getCart = async (req, res) => {
  try {
    const { buyerId } = req.query;
    console.log("BuyerId received:", buyerId);
    if (!buyerId) {
      return res.status(400).json({ error: "BuyerId is required" });
    }
    const cartItems = await CartModel.find({ buyerId })
      .populate("productId", "name image price discount inStock properties"); // Populate thông tin sản phẩm
    if (!cartItems || cartItems.length === 0) {
      return res.status(200).json({ message: "Cart is empty", cart: [] });
    }
    const cartDetails = cartItems.map((item) => {
      const product = item.productId;
      return {
        id: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        discount: product.discount,
        inStock: product.inStock,
        totalSold: product.properties?.totalSold || 0, // Lấy tổng sản phẩm đã bán (nếu có)
        quantity: item.quantity,
      };
    });
    res.status(200).json({ cart: cartDetails });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Thêm sản phẩm vào giỏ hàng
const addToCart = async (req, res) => {
  try {
    const { buyerId, productId, quantity } = req.body;

    if (!buyerId || !productId) {
      return res.status(400).json({ error: "BuyerId và ProductId là bắt buộc" });
    }

    const buyer = await BuyerModel.findById(buyerId);
    if (!buyer) {
      return res.status(404).json({ error: "Người mua không tồn tại" });
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Sản phẩm không tồn tại" });
    }

    const existingCart = await CartModel.findOne({ buyerId, productId });
    if (existingCart) {
      return res.status(400).json({ message: "Sản phẩm đã có trong giỏ hàng" });
    }

    const newCartItem = new CartModel({
      buyerId,
      productId,
      quantity: quantity || 1,
    });

    await newCartItem.save();

    res.status(200).json({ message: "Thêm sản phẩm vào giỏ hàng thành công" });
  } catch (error) {
    console.error("Lỗi khi thêm vào giỏ hàng:", error);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
  }
};
// Cập nhật số lượng sản phẩm trong giỏ hàng
const updateQuantity = async (req, res) => {
  try {
    const { buyerId, productId, quantity } = req.body;

    if (!buyerId || !productId || quantity === undefined) {
      return res.status(400).json({ error: "BuyerId, ProductId, and Quantity are required" });
    }

    if (quantity <= 0) {
      return res.status(400).json({ error: "Quantity must be greater than 0" });
    }

    const cartItem = await CartModel.findOne({ buyerId, productId });
    if (!cartItem) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({ message: "Quantity updated successfully" });
  } catch (error) {
    console.error("Error updating quantity:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Xóa sản phẩm khỏi giỏ hàng
const removeFromCart = async (req, res) => {
  try {
    const { buyerId, productId } = req.body;

    if (!buyerId || !productId) {
      return res.status(400).json({ error: "BuyerId and ProductId are required" });
    }

    const cartItem = await CartModel.findOne({ buyerId, productId });
    if (!cartItem) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    await CartModel.deleteOne({ _id: cartItem._id });

    res.status(200).json({ message: "Product removed from cart successfully" });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export { getCart, addToCart, updateQuantity, removeFromCart };