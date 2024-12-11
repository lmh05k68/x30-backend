import SellerModel from "../models/Seller.js";

export const createSeller = (data) => SellerModel.create(data)
export const findSeller= (info) => SellerModel.findOne(info)
export const findSellerById = (id) => SellerModel.findById(id).select("-password")
export const findSellerByEmail = (email) => SellerModel.findOne({email})
export const findSellerAndUpdate = (...args) => SellerModel.findByIdAndUpdate(...args)
export const getSellers = async (query = {}) => {
    const mongoQuery = {}
    const pageSize = query.pageSize ?? 10 
    const page = query.page ?? 1
    const sellers = await SellerModel.find(mongoQuery).limit(pageSize).skip((page - 1) * pageSize)
    const count = await SellerModel.find(mongoQuery).countDocuments()
    return {sellers, count, page, pageSize}
}