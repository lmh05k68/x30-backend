import ProductGroupModel from "../models/ProductGroup.js";
import CartModel from '../models/Cart.js'
import BuyerModel from '../models/Buyer.js'
// Controller: Lấy thông tin giỏ hàng
const getCart = async (req, res) => {
  try {
    // Lấy buyerId từ query hoặc token (giả sử trong query ở đây)
    const { buyerId } = req.query;
    console.log("BuyerId received:", buyerId);

    if (!buyerId) {
      return res.status(400).json({ error: "BuyerId is required" });
    }
    
    // Tìm giỏ hàng của buyer trong CartModel
    const cartItems = await CartModel.find({ buyerId })
      .populate("productGroupId", "title brand image description averageRate categoryIds")  // Populate thông tin sản phẩm
      .populate("productGroupId.categoryIds", "name"); // Populate thông tin danh mục
    
    // Nếu không có sản phẩm trong giỏ hàng
    if (!cartItems || cartItems.length === 0) {
      return res.status(200).json({ message: "Cart is empty", cart: [] });
    }

    // Lấy thông tin chi tiết giỏ hàng từ cartItems và thêm số lượng vào
    const cartDetails = cartItems.map((item) => {
      const group = item.productGroupId;
      return {
        id: group._id,
        title: group.title,
        brand: group.brand,
        image: group.image,
        description: group.description,
        averageRate: group.averageRate,
        categories: group.categoryIds.map((category) => category.name), // Lấy tên danh mục
        quantity: item.quantity, // Thêm số lượng vào kết quả
      };
    });

    // Trả kết quả giỏ hàng
    res.status(200).json({ cart: cartDetails });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Thêm sản phẩm vào giỏ hàng
const addToCart = async (req, res) => {
  try {
    const { buyerId, productGroupId, quantity } = req.body;

    // Kiểm tra input đầu vào
    if (!buyerId || !productGroupId) {
      return res.status(400).json({ error: "BuyerId và ProductGroupId là bắt buộc" });
    }

    // Kiểm tra buyerId có hợp lệ không
    const buyer = await BuyerModel.findById(buyerId);
    if (!buyer) {
      return res.status(404).json({ error: "Người mua không tồn tại" });
    }

    // Kiểm tra sản phẩm có tồn tại trong cơ sở dữ liệu hay không
    const productGroup = await ProductGroupModel.findById(productGroupId);
    if (!productGroup) {
      return res.status(404).json({ error: "Nhóm sản phẩm không tồn tại" });
    }

    // Kiểm tra sản phẩm đã có trong giỏ hàng của người mua chưa
    const existingCart = await CartModel.findOne({ buyerId, productGroupId });
    if (existingCart) {
      return res.status(400).json({ message: "Sản phẩm đã có trong giỏ hàng" });
    }

    // Thêm sản phẩm vào giỏ hàng (thêm số lượng nếu có)
    const newCartItem = new CartModel({
      buyerId,
      productGroupId,
      quantity: quantity || 1, // Nếu không có quantity thì mặc định là 1
    });

    await newCartItem.save();

    res.status(200).json({ message: "Thêm sản phẩm vào giỏ hàng thành công" });
  } catch (error) {
    console.error("Lỗi khi thêm vào giỏ hàng:", error); // Log lỗi chi tiết
    res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
  }
};

const updateQuantity = async (req, res) => {
  try {
    const { buyerId, productGroupId, quantity } = req.body;

    if (!buyerId || !productGroupId || quantity === undefined) {
      return res.status(400).json({ error: "BuyerId, ProductGroupId, and Quantity are required" });
    }

    if (quantity <= 0) {
      return res.status(400).json({ error: "Quantity must be greater than 0" });
    }

    // Kiểm tra nếu sản phẩm tồn tại trong giỏ hàng của người mua
    const cartItem = await CartModel.findOne({
      buyerId: buyerId,  // Sửa lại đây cho phù hợp
      productGroupId: productGroupId,
    });

    if (!cartItem) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    await CartModel.updateOne(
      { _id: cartItem._id }, // Cập nhật dựa trên ID của sản phẩm trong giỏ hàng
      { $set: { quantity } }  // Cập nhật số lượng
    );

    res.status(200).json({ message: "Quantity updated successfully" });
  } catch (error) {
    console.error("Error updating quantity:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { buyerId, productGroupId } = req.body;

    if (!buyerId || !productGroupId) {
      return res.status(400).json({ error: "BuyerId and ProductGroupId are required" });
    }

    // Kiểm tra nếu sản phẩm có trong giỏ hàng của người mua
    const cartItem = await CartModel.findOne({
      buyerId: buyerId,
      productGroupId: productGroupId,
    });

    if (!cartItem) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    // Xóa sản phẩm khỏi giỏ hàng
    await CartModel.deleteOne({
      buyerId: buyerId,
      productGroupId: productGroupId,
    });

    res.status(200).json({ message: "Product removed from cart successfully" });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export { getCart,addToCart, updateQuantity,removeFromCart };