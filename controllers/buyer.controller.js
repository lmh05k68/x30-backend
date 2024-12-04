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

import { findBuyerByEmail, createBuyer, findBuyer, findBuyerAndUpdate} from '../repositories/buyer.repository.js'
import { userStatus } from "../const/user.const.js";
//người mua đăng kí
const buyerRegister = async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;
  try {
    const checkUser = await findBuyerByEmail(email);
    if (checkUser) throw new Error(req.translate('user.emailExisted'));

    const salt = bcrypt.genSaltSync(+process.env.SALT_ROUNDS);
    const hash = bcrypt.hashSync(password, salt);
    const newUser = await createBuyer({
      name,
      email,
      password: hash,
      phoneNumber
    });

    console.log("User registered:", newUser);  // Thêm log

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

const buyerLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findBuyer({ email });
    console.log("User found:", user);  // Thêm log
    
    if (!user) throw new Error(req.translate('user.wrong'));

    const checkPassword = bcrypt.compareSync(password.toString(), user.password);
    console.log("Password match:", checkPassword);  // Thêm log
    
    if (!checkPassword) throw new Error(req.translate('user.wrong'));

    if(user.status == userStatus.inactive) throw new Error(req.translate('user.banned'));

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
const buyerProfile = async (req, res) => {
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
const buyerUpdateProfile = async (req, res) => {
  const body = req.body
  try {
    const { _id }= req.currentUser
    await findBuyerAndUpdate({
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
export {buyerLogin,buyerRegister, buyerProfile, buyerUpdateProfile}