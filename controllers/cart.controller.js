import ProductGroupModel from "../models/ProductGroup.js";
// Controller: Lấy thông tin giỏ hàng
const getCart = async (req, res) => {
  try {
    // Lấy buyerId từ query hoặc token (giả sử trong query ở đây)
    const { buyerId } = req.query;
    if (!buyerId) {
      return res.status(400).json({ error: "BuyerId is required" });
    }
    // Tìm giỏ hàng của buyer (giả sử buyer có productGroupIds)
    const cartProductGroups = await ProductGroupModel.find({
      "shopId": buyerId, // Tùy chỉnh điều kiện theo dữ liệu thực tế
    }).populate("categoryIds", "name"); // Populate category name từ categoryIds
    // Nếu không có sản phẩm
    if (!cartProductGroups || cartProductGroups.length === 0) {
      return res.status(200).json({ message: "Cart is empty", cart: [] });
    }
    // Lấy thông tin giỏ hàng
    const cartDetails = cartProductGroups.map((group) => ({
      id: group._id,
      title: group.title,
      brand: group.brand,
      image: group.image,
      description: group.description,
      averageRate: group.averageRate,
      categories: group.categoryIds.map((category) => category.name), // Lấy tên danh mục
    }));
    // Trả kết quả
    res.status(200).json({ cart: cartDetails });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addToCart = async (req, res) => {
    try {
      const { buyerId, productGroupId } = req.body;
  
      if (!buyerId || !productGroupId) {
        return res.status(400).json({ error: "BuyerId and ProductGroupId are required" });
      }
  
      // Tìm giỏ hàng của người mua (dựa trên shopId)
      const productGroup = await ProductGroupModel.findById(productGroupId);
      if (!productGroup) {
        return res.status(404).json({ error: "Product Group not found" });
      }
  
      // Kiểm tra xem sản phẩm đã có trong giỏ hàng của người mua chưa
      const existingCart = await ProductGroupModel.findOne({
        shopId: buyerId,
        _id: productGroupId,
      });
  
      if (existingCart) {
        return res.status(400).json({ message: "Product is already in the cart" });
      }
  
      // Thêm sản phẩm vào giỏ hàng của người mua
      await ProductGroupModel.updateOne(
        { _id: productGroupId },
        { $push: { shopId: buyerId } } // Giả sử shopId là người mua
      );
  
      res.status(200).json({ message: "Product added to cart successfully" });
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ error: "Internal server error" });
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
      const productGroup = await ProductGroupModel.findOne({
        shopId: buyerId,
        _id: productGroupId,
      });
  
      if (!productGroup) {
        return res.status(404).json({ error: "Product not found in cart" });
      }
  
      // Cập nhật số lượng sản phẩm trong giỏ hàng
      await ProductGroupModel.updateOne(
        { _id: productGroupId },
        { $set: { quantity } } // Cập nhật số lượng sản phẩm
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
      const productGroup = await ProductGroupModel.findOne({
        shopId: buyerId,
        _id: productGroupId,
      });
  
      if (!productGroup) {
        return res.status(404).json({ error: "Product not found in cart" });
      }
  
      // Xóa sản phẩm khỏi giỏ hàng của người mua
      await ProductGroupModel.updateOne(
        { _id: productGroupId },
        { $pull: { shopId: buyerId } } // Xóa sản phẩm khỏi giỏ hàng
      );
  
      res.status(200).json({ message: "Product removed from cart successfully" });
    } catch (error) {
      console.error("Error removing product from cart:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
export { getCart,addToCart, updateQuantity,removeFromCart };