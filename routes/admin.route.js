import {Router} from 'express'
import { getAccounts } from '../controllers/admin.controller.js';
import { adminProfile, adminUpdateProfile} from "../controllers/admin.controller.js";
import {validateUpdateAdminRequest} from '../validations/admin.validation.js'
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
const AdminRouter = Router()
BuyerRouter.get('/admin',buyerProfile)
BuyerRouter.patch('/admin', validateUpdateAdminRequest, adminUpdateProfile,)
AdminRouter.get('/admin/accounts', getAccounts);
export default AdminRouter