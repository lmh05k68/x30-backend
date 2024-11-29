import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";
import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
dotenv.config()
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

import { findSellerByEmail, createSeller, findSeller, findSellerAndUpdate} from '../repositories/seller.repository.js'
//người mua đăng kí
const sellerRegister = async (req, res) => {
    const { name, email, password, phone } = req.body;
    try {
      const checkUser = await findSellerByEmail(email);
      if (checkUser) throw new Error(req.translate('user.emailExisted'));
      const salt = bcrypt.genSaltSync(+process.env.SALT_ROUNDS);
      const hash = bcrypt.hashSync(password, salt);
      const newUser = await createSeller({
        name,
        email,
        password: hash,
        phone
      });
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
//người mua đăng nhập
const sellerLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await findSeller({ email });
      if (!user) throw new Error(req.translate('user.wrong'));
      const checkPassword = bcrypt.compareSync(
        password.toString(),
        user.password
      );
      if (!checkPassword) throw new Error(req.translate('user.wrong'));
      if(user.status) throw new Error(req.translate('user.banned'))
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
//profile người mua
const sellerProfile = async (req, res) => {
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
//update profile người mua
const sellerUpdateProfile = async (req, res) => {
  const body = req.body
  try {
    const { _id }= req.currentUser
    await findSellerAndUpdate({
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
export {sellerLogin,sellerRegister, sellerProfile, sellerUpdateProfile}