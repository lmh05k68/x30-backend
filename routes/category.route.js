import { Router } from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
const CategoryRouter = Router()
CategoryRouter.get("/", getCategories);
export default CategoryRouter