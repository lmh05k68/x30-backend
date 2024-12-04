import {Router} from 'express'
import { adminProfile, adminUpdateProfile,toggleAccountStatus,getAccounts} from "../controllers/admin.controller.js";
import {validateUpdateAdminRequest} from '../validations/admin.validation.js'
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
const AdminRouter = Router()
BuyerRouter.get('/admin',adminProfile)
BuyerRouter.patch('/admin', validateUpdateAdminRequest, adminUpdateProfile,)
AdminRouter.get('/admin/accounts', getAccounts);
AdminRouter.patch('/admin/accounts/:type/:id', toggleAccountStatus);
export default AdminRouter