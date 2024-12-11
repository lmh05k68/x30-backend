import mongoose from "mongoose";
import collections from "../const/collection.const.js";
const categorySchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId()
  },
  name: {
    type: String,
    required: true, 
    trim: true,    
  },
});
const CategoryModel = mongoose.model(collections.categories, categorySchema);
export default CategoryModel;