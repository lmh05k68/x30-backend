import jwt from "jsonwebtoken";
import crypto from 'crypto'
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});
import nodemailer from "nodemailer";
import {
  findBuyerByEmail,
  createBuyer,
  findBuyer,
  findBuyerAndUpdate,
} from "../repositories/buyer.repository.js";
import { userStatus } from "../const/user.const.js";
import {
  getAllProductGroups,
  getProductGroupById,
} from "../repositories/productGroups.repository.js";
import { getProductsByIds } from "../repositories/products.repository.js";
import BuyerModel from '../models/Buyer.js'
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465, // Cổng bảo mật SSL
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  debug: true, // Hiển thị toàn bộ log debug
  logger: true,
});
//người mua đăng kí
export const buyerRegister = async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;
  try {
    const checkUser = await findBuyerByEmail(email);
    if (checkUser) throw new Error(req.translate("user.emailExisted"));

    const salt = bcrypt.genSaltSync(+process.env.SALT_ROUNDS);
    const hash = bcrypt.hashSync(password, salt);
    const newUser = await createBuyer({
      name,
      email,
      password: hash,
      phoneNumber,
    });

    console.log("User registered:", newUser); // Thêm log

    return res.status(201).send({
      message: "Created success",
      newUser,
    });
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
};

export const buyerLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findBuyer({ email });
    console.log("User found:", user); // Thêm log

    if (!user) throw new Error(req.translate("user.wrong"));

    const checkPassword = bcrypt.compareSync(
      password.toString(),
      user.password
    );
    console.log("Password match:", checkPassword); // Thêm log

    if (!checkPassword) throw new Error(req.translate("user.wrong"));

    if (user.status == userStatus.inactive)
      throw new Error(req.translate("user.banned"));

    const { _id } = user;
    const accessToken = jwt.sign({ _id }, process.env.ACCESS_TK_KEY);
    const refreshToken = jwt.sign({ _id }, process.env.REFRESH_TK_KEY);

    res.status(201).send({
      message: "login success",
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    res.status(401).send({
      message: error.message,
    });
  }
};

//profile người mua
export const buyerProfile = async (req, res) => {
  try {
    const user = req.currentUser;
    if (!user) throw new Error(req.translate("unauthorized"));
    res.status(200).send({
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(403).send({
      message: error.message,
    });
  }
};
//update profile người mua
export const buyerUpdateProfile = async (req, res) => {
  const body = req.body;
  try {
    const { _id } = req.currentUser;
    await findBuyerAndUpdate(
      {
        _id,
      },
      {
        ...body,
      }
    );
    res.status(201).send({
      message: req.translate("user.updateProfile"),
    });
  } catch (error) {
    res.status(403).send({
      message: error.message,
    });
  }
};

export const getProductGroups = async (req, res) => {
  const { keyword, page, pageSize } = req.query;
  try {
    const data = await getAllProductGroups({ keyword, page, pageSize });
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

export const getProductGroup = async (req, res) => {
  const { id } = req.params;
  try {
    const productGroup = await getProductGroupById(id);
    if (!productGroup) {
      throw new Error("Sản phẩm không tồn tại");
    }
    const products = await getProductsByIds(productGroup.productIds);

    return res.status(200).send({
      ...productGroup.toObject(),
      products,
    });
  } catch (e) {
    return res.status(404).send({ message: e.message });
  }
};
// API quên mật khẩu
export const buyerForgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await BuyerModel.findOne({ email });
    if (!user) throw new Error(req.translate("user.emailNotFound"));

    // Tạo token xác thực đặt lại mật khẩu
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordToken = jwt.sign(
      { resetToken, email },
      process.env.RESET_TK_KEY,
      { expiresIn: "15m" } // Token hết hạn sau 15 phút
    );

    // Lưu token vào database
    user.resetToken = resetToken;
    user.tokenExpiration = Date.now() + 15 * 60 * 1000; // 15 phút
    await user.save();

    // Gửi email
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetPasswordToken}`;
    try {
      const result = await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: "Password Reset Request",
        html: `<p>Chào ${user.name},</p>
               <p>Bạn đã yêu cầu đặt lại mật khẩu. Nhấn vào đường dẫn dưới đây để tiếp tục:</p>
               <a href="${resetUrl}">Đặt lại mật khẩu</a>
               <p>Đường dẫn sẽ hết hạn sau 15 phút.</p>`,
      });
      console.log("Email sent successfully:", result);
    } catch (error) {
      console.error("Error occurred while sending email:", error);
    }

    // Log token ra console
    console.log("Reset Password Token (JWT):", resetPasswordToken);
    console.log("Reset Token (DB):", resetToken);

    res.status(200).send({ message: req.translate("user.resetEmailSent") });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
//buyer reset password
export const buyerResetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.RESET_TK_KEY);
    const { resetToken, email } = decoded;

    const user = await BuyerModel.findOne({ email, resetToken });
    if (!user || user.tokenExpiration < Date.now())
      throw new Error(req.translate("user.invalidToken"));

    // Mã hóa mật khẩu mới
    const salt = bcrypt.genSaltSync(+process.env.SALT_ROUNDS);
    const hash = bcrypt.hashSync(password, salt);

    // Cập nhật mật khẩu và xóa token
    user.password = hash;
    user.resetToken = null;
    user.tokenExpiration = null;

    // Log trạng thái trước khi lưu
    console.log("User before save:", user);

    // Lưu thay đổi
    await user.save();

    // Log sau khi lưu
    console.log("User updated successfully:", user);

    res.status(200).send({ message: req.translate("user.passwordUpdated") });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(400).send({ message: error.message });
  }
};