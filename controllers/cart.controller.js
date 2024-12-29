import ProductModel from "../models/Product.js";
import CartModel from "../models/Cart.js";
import BuyerModel from "../models/Buyer.js";

// Lấy thông tin giỏ hàng
const getCart = async (req, res) => {
  try {
    const { buyerId } = req.query;
    if (!buyerId) {
      return res.status(400).json({ error: "Vui lòng cung cấp BuyerId." });
    }

    const cartItems = await CartModel.find({ buyerId })
      .populate("productId", "name image price discount inStock properties");
    
    if (!cartItems.length) {
      return res.status(200).json({ message: "Giỏ hàng trống.", cart: [] });
    }

    const cartDetails = cartItems.map((item) => ({
      id: item.productId._id,
      name: item.productId.name,
      image: item.productId.image,
      price: item.productId.price,
      discount: item.productId.discount,
      inStock: item.productId.inStock,
      totalSold: item.productId.properties?.totalSold || 0,
      quantity: item.quantity,
    }));

    res.status(200).json({ cart: cartDetails });
  } catch (error) {
    console.error("Lỗi khi lấy giỏ hàng:", error);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ." });
  }
};

// Thêm sản phẩm vào giỏ hàng
const addToCart = async (req, res) => {
  try {
    const { buyerId, productId, quantity } = req.body;
    if (!buyerId || !productId) {
      return res.status(400).json({ error: "BuyerId và ProductId là bắt buộc." });
    }

    const buyer = await BuyerModel.findById(buyerId);
    if (!buyer) {
      return res.status(404).json({ error: "Người mua không tồn tại." });
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Sản phẩm không tồn tại." });
    }

    let cartItem = await CartModel.findOne({ buyerId, productId });

    if (cartItem) {
      // Nếu sản phẩm đã tồn tại, tăng số lượng
      cartItem.quantity += quantity || 1;
      await cartItem.save();
      return res.status(200).json({ message: "Số lượng sản phẩm đã được cập nhật." });
    }

    // Nếu sản phẩm chưa tồn tại, thêm mới
    cartItem = new CartModel({
      buyerId,
      productId,
      quantity: quantity || 1,
    });

    await cartItem.save();
    res.status(200).json({ message: "Thêm sản phẩm vào giỏ hàng thành công." });
  } catch (error) {
    console.error("Lỗi khi thêm vào giỏ hàng:", error);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ." });
  }
};

// Cập nhật số lượng sản phẩm
const updateQuantity = async (req, res) => {
  try {
    const { buyerId, productId, quantity } = req.body;
    if (!buyerId || !productId || quantity === undefined) {
      return res.status(400).json({ error: "BuyerId, ProductId và Quantity là bắt buộc." });
    }

    if (quantity <= 0) {
      return res.status(400).json({ error: "Quantity phải lớn hơn 0." });
    }

    const cartItem = await CartModel.findOne({ buyerId, productId });
    if (!cartItem) {
      return res.status(404).json({ error: "Sản phẩm không tồn tại trong giỏ hàng." });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({ message: "Số lượng sản phẩm đã được cập nhật." });
  } catch (error) {
    console.error("Lỗi khi cập nhật số lượng:", error);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ." });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
const removeFromCart = async (req, res) => {
  try {
    const { buyerId, productId } = req.body;
    if (!buyerId || !productId) {
      return res.status(400).json({ error: "BuyerId và ProductId là bắt buộc." });
    }

    const cartItem = await CartModel.findOne({ buyerId, productId });
    if (!cartItem) {
      return res.status(404).json({ error: "Sản phẩm không tồn tại trong giỏ hàng." });
    }

    await CartModel.deleteOne({ _id: cartItem._id });
    res.status(200).json({ message: "Sản phẩm đã được xóa khỏi giỏ hàng." });
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ." });
  }
};

export { getCart, addToCart, updateQuantity, removeFromCart };