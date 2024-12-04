import AdminModel from '../models/Admin.js'
export const createAdmin = (data) => AdminModel.create(data)
export const findAdmin = (info) => AdminModel.findOne(info)
export const findAdminById = (id) => AdminModel.findById(id).select("-password")
export const findAdminByEmail = (email) => AdminModel.findOne({email})
export const findAdminAndUpdate = (...args) => AdminModel.findByIdAndUpdate(...args)