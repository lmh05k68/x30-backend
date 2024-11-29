import SellerModel from "../models/Seller.js";

export const createSeller = (data) => SellerModel.create(data)
export const findSeller= (info) => SellerModel.findOne(info)
export const findSellerById = (id) => SellerModel.findById(id).select("-password")
export const findSellerByEmail = (email) => SellerModel.findOne({email})
export const findSellerAndUpdate = (...args) => SellerModel.findByIdAndUpdate(...args)

