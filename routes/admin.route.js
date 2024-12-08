import {Router} from 'express'
import { adminProfile, adminUpdateProfile,toggleAccountStatus,getAccounts,deleteAccount,updateAccount,addAccount} from "../controllers/admin.controller.js";
import {validateUpdateAdminRequest} from '../validations/admin.validation.js'
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
const AdminRouter = Router()
BuyerRouter.get('/admin',adminProfile)
BuyerRouter.patch('/admin', validateUpdateAdminRequest, adminUpdateProfile,)
AdminRouter.get('/admin/accounts', getAccounts);
AdminRouter.patch('/admin/accounts/:type/:id', toggleAccountStatus);
AdminRouter.post('/admin/accounts/:type', addAccount); // Thêm tài khoản
AdminRouter.patch('/admin/accounts/:type/:id', updateAccount); // Sửa tài khoản
AdminRouter.delete('/admin/accounts/:type/:id', deleteAccount); // Xóa tài khoản

export default AdminRouter