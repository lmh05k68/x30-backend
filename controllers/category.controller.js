import CategoryModel from "../models/Category.js";
//Tạo Category
export const createCategory = async (req, res) => {
    const { name } = req.body;
    try {
      const category = new CategoryModel({ name });
      await category.save();
      res.status(201).json({
        message: "Category created successfully",
        category,
      });
    } catch (error) {
      res.status(400).json({ message: "Error creating category", error });
    }
  };
  
  //Lấy danh sách Category
  export const getCategories = async (req, res) => {
    try {
      const categories = await CategoryModel.find({});
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: "Error fetching categories", error });
    }
  };
  
  //Lấy chi tiết một Category
  export const getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
      const category = await CategoryModel.findById(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ message: "Error fetching category", error });
    }
  };
  
  //Cập nhật Category
  export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
      const category = await CategoryModel.findByIdAndUpdate(
        id,
        { name },
        { new: true, runValidators: true }
      );
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.status(200).json({
        message: "Category updated successfully",
        category,
      });
    } catch (error) {
      res.status(400).json({ message: "Error updating category", error });
    }
  };
  
  //Xóa Category
  export const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
      const category = await CategoryModel.findByIdAndDelete(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting category", error });
    }
  };