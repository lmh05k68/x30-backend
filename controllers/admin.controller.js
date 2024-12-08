import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";
import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
import { findSeller,findSellerAndUpdate ,createSeller} from '../repositories/seller.repository.js';
import { findBuyer,findBuyerAndUpdate,createBuyer } from '../repositories/buyer.repository.js';
import BuyerModel from '../models/Buyer.js'
import SellerModel from '../models/Seller.js'
dotenv.config()
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});
import { findAdminByEmail, createAdmin, findAdmin, findAdminAndUpdate} from '../repositories/admin.repository.js'

//đăng kí admin
const adminRegister = async (req, res) => {
    const { name, email, password, phoneNumber } = req.body;
    try {
      const checkUser = await findAdminByEmail(email);
      if (checkUser) throw new Error(req.translate('user.emailExisted'));
  
      const salt = bcrypt.genSaltSync(+process.env.SALT_ROUNDS);
      const hash = bcrypt.hashSync(password, salt);
      const newUser = await createAdmin({
        name,
        email,
        password: hash,
        phoneNumber
      });
  
      console.log("Admin registered:", newUser);  // Thêm log
  
      return res.status(201).send({
        message: "Created success",
        newUser
      });
    } catch (error) {
      return res.status(400).send({
        message: error.message
      });
    }
  };
  
  const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await findAdmin({ email });
      console.log("Admin found:", user);  // Thêm log
      
      if (!user) throw new Error(req.translate('user.wrong'));
  
      const checkPassword = bcrypt.compareSync(password.toString(), user.password);
      console.log("Password match:", checkPassword);  // Thêm log
      
      if (!checkPassword) throw new Error(req.translate('user.wrong'));
  
      if(user.status === 1) throw new Error(req.translate('user.banned'));
  
      const { _id } = user;
      const accessToken = jwt.sign({ _id }, process.env.ACCESS_TK_KEY);
      const refreshToken = jwt.sign({ _id }, process.env.REFRESH_TK_KEY);
  
      res.status(201).send({
        message: "login success",
        data: {
          accessToken,
          refreshToken
        },
      });
    } catch (error) {
      res.status(401).send({
        message: error.message,
      });
    }
  };
  
  //profile admin
  const adminProfile = async (req, res) => {
    try {
      const user = req.currentUser;
      if(!user) throw new Error(req.translate('unauthorized'))
      res.status(200).send({
        data: {
          user
        },
      });
    } catch (error) {
      res.status(403).send({
        message: error.message,
      });
    }
  };
  //update profile admin
  const adminUpdateProfile = async (req, res) => {
    const body = req.body
    try {
      const { _id }= req.currentUser
      await findAdminAndUpdate({
        _id
      },{
        ...body
      })
      res.status(201).send({
        message: req.translate('user.updateProfile'),
      });
    } catch (error) {
      res.status(403).send({
        message: error.message,
      });
    }
  };

  //lấy danh sách tài khoản 
  const getAccounts = async (req, res) => {
    try {
      // Lấy danh sách người bán
      const sellers = await findSeller({});
      
      // Lấy danh sách người mua
      const buyers = await findBuyer({});
      
      // Trả về kết quả
      res.status(200).send({
        message: "Accounts fetched successfully",
        data: {
          sellers,
          buyers
        }
      });
    } catch (error) {
      res.status(400).send({
        message: error.message
      });
    }
  };

  //khóa/mở khóa 
  const toggleAccountStatus = async (req, res) => {
    const { type, id } = req.params; // `type` là "buyer" hoặc "seller", `id` là _id của tài khoản
    const { status } = req.body; // `status` là trạng thái muốn cập nhật (0 hoặc 1)
  
    try {
      if (!['buyer', 'seller'].includes(type)) {
        throw new Error('Invalid account type'); // Kiểm tra loại tài khoản
      }
      if (![0, 1].includes(status)) {
        throw new Error('Invalid status'); // Kiểm tra giá trị trạng thái
      }
  
      const updateFn = type === 'buyer' ? findBuyerAndUpdate : findSellerAndUpdate;
  
      const updatedAccount = await updateFn(
        { _id: id },
        { status }
      );
  
      if (!updatedAccount) {
        throw new Error('Account not found');
      }
  
      res.status(200).send({
        message: status === 1 ? 'Account locked successfully' : 'Account unlocked successfully',
        updatedAccount,
      });
    } catch (error) {
      res.status(400).send({
        message: error.message,
      });
    }
  };

  //thêm tài khoản người mua/bán
  const addAccount = async (req, res) => {
    const { type } = req.params; // "buyer" hoặc "seller"
    const data = req.body;
  
    try {
      if (!['buyer', 'seller'].includes(type)) {
        throw new Error('Invalid account type');
      }
  
      const createFn = type === 'buyer' ? createBuyer : createSeller;
  
      const newAccount = await createFn(data);
      res.status(201).send({
        message: 'Account created successfully',
        newAccount,
      });
    } catch (error) {
      res.status(400).send({
        message: error.message,
      });
    }
  };
  
  //sửa tài khoản người mua/bán
  const updateAccount = async (req, res) => {
    const { type, id } = req.params; // "buyer" hoặc "seller", và ID của tài khoản
    const data = req.body;
  
    try {
      if (!['buyer', 'seller'].includes(type)) {
        throw new Error('Invalid account type');
      }
  
      const updateFn = type === 'buyer' ? findBuyerAndUpdate : findSellerAndUpdate;
  
      const updatedAccount = await updateFn(
        { _id: id },
        { ...data },
        { new: true }
      );
  
      if (!updatedAccount) {
        throw new Error('Account not found');
      }
  
      res.status(200).send({
        message: 'Account updated successfully',
        updatedAccount,
      });
    } catch (error) {
      res.status(400).send({
        message: error.message,
      });
    }
  };

  //xóa tài khoản người mua/bán
  const deleteAccount = async (req, res) => {
    const { type, id } = req.params;
  
    try {
      if (!['buyer', 'seller'].includes(type)) {
        throw new Error('Invalid account type');
      }
  
      const deleteFn =
        type === 'buyer' ? BuyerModel.findByIdAndDelete : SellerModel.findByIdAndDelete;
  
      const deletedAccount = await deleteFn(id);
  
      if (!deletedAccount) {
        throw new Error('Account not found');
      }
  
      res.status(200).send({
        message: 'Account deleted successfully',
      });
    } catch (error) {
      res.status(400).send({
        message: error.message,
      });
    }
  };
  
  export {adminLogin,adminRegister, adminProfile, adminUpdateProfile,getAccounts,toggleAccountStatus,deleteAccount,updateAccount,addAccount}