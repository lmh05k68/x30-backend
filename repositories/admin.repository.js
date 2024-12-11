import AdminModel from '../models/Admin.js'
export const createAdmin = (data) => AdminModel.create(data)
export const findAdmin = (info) => AdminModel.findOne(info)
export const findAdminById = (id) => AdminModel.findById(id).select("-password")
export const findAdminByEmail = (email) => AdminModel.findOne({email})
export const findAdminAndUpdate = (...args) => AdminModel.findByIdAndUpdate(...args)
export const getAdmins = async (query = {}) => {
    const mongoQuery = {}
    const pageSize = query.pageSize ?? 10 
    const page = query.page ?? 1
    const admins = await AdminModel.find(mongoQuery).limit(pageSize).skip((page - 1) * pageSize)
    const count = await AdminModel.find(mongoQuery).countDocuments()
    return {admins, count, page, pageSize}
}