import BuyerModel from "../models/Buyer.js";

export const createBuyer = (data) => BuyerModel.create(data)
export const findBuyer = (info) => BuyerModel.findOne(info)
export const findBuyerById = (id) => BuyerModel.findById(id).select("-password")
export const findBuyerByEmail = (email) => BuyerModel.findOne({email})
export const findBuyerAndUpdate = (...args) => BuyerModel.findByIdAndUpdate(...args)

