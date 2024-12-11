import CategoryModel from '../models/Category.js'
export const createCategory = (data) => CategoryModel.create(data)
export const findCategory = (info) => CategoryModel.findOne(info)
export const findCategoryById = (id) => CategoryModel.findById(id).select("-password")