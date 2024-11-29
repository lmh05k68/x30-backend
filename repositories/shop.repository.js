import ShopModel from "../models/Shop.js";

export const createShop = (data) => ShopModel.create(data)
export const findShop = (info) => ShopModel.findOne(info)
export const findShopById = (id) => ShopModel.findById(id).select("-password")
export const findShopByEmail = (email) => ShopModel.findOne({email})
export const findShopAndUpdate = (...args) => ShopModel.findByIdAndUpdate(...args)

