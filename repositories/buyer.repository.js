import BuyerModel from "../models/Buyer.js";

export const createBuyer = (data) => BuyerModel.create(data)
export const findBuyer = (info) => BuyerModel.findOne(info)
export const findBuyerById = (id) => BuyerModel.findById(id).select("-password")
export const findBuyerByEmail = (email) => BuyerModel.findOne({email})
export const findBuyerAndUpdate = (...args) => BuyerModel.findByIdAndUpdate(...args)
export const getBuyers = async (query = {}) => {
    const mongoQuery = {}
    const pageSize = query.pageSize ?? 10 
    const page = query.page ?? 1
    const buyers = await BuyerModel.find(mongoQuery).limit(pageSize).skip((page - 1) * pageSize)
    const count = await BuyerModel.find(mongoQuery).countDocuments()
    return {buyers, count, page, pageSize}
}