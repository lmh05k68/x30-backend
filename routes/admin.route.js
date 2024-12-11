import {Router} from 'express'
import { adminProfile, adminUpdateProfile,toggleAccountStatus,getBuyerAccounts,getSellerAccounts,getAdminAccounts,deleteAccount,updateAccount,addAccount} from "../controllers/admin.controller.js";
import {validateUpdateAdminRequest} from '../validations/admin.validation.js'

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
const AdminRouter = Router()
AdminRouter.get('/',adminProfile)
AdminRouter.patch('/', validateUpdateAdminRequest, adminUpdateProfile)
AdminRouter.get('/buyer-accounts', getBuyerAccounts);//danh sách tài khoản người mua
AdminRouter.get('/seller-accounts', getSellerAccounts);//danh sách tài khoản người bán
AdminRouter.get('/admin-accounts', getAdminAccounts);//danh sách tài khoản người admin
AdminRouter.patch('/accounts/:type/:id', toggleAccountStatus);//khóa/mở khóa
AdminRouter.post('/accounts/:type', addAccount); // Thêm tài khoản
AdminRouter.patch('/accounts/:type/:id', updateAccount); // Sửa tài khoản
AdminRouter.delete('/accounts/:type/:id', deleteAccount); // Xóa tài khoản

export default AdminRouter