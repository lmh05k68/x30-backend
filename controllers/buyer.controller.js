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
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({
        message: req.translate("validation.required", {
          field: req.translate("user.credentials"),
        }),
      });
    }
    // Tìm người mua dựa trên email
    const buyer = await BuyerModel.findOne({ email });

    if (!buyer) {
      return res.status(404).send({
        message:"Mật khẩu hoặc email sai"
      });
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, buyer.password);
    if (!isPasswordValid) {
      return res.status(401).send({
        message: req.translate("error.invalidCredentials"),
      });
    }

    // Tạo token đăng nhập
    const token = jwt.sign({ id: buyer._id }, process.env.ACCESS_TK_KEY);

    // Cập nhật trạng thái và lưu token
    // await BuyerModel.findByIdAndUpdate(buyer._id, {
    //   resetToken: token,
    //   tokenExpiration: Date.now() + 3600000, // 1 giờ
    //   status: userStatus.active,
    // });

    res.status(201).send({
      message:"Đăng nhập thành công",
      token,
    });
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: "Sai mật khẩu hoặc email"
    });
  }
};
//log out 
export const logoutBuyer = async (req, res) => {
  try {
    const { buyerId } = req.body; // Lấy buyerId từ body request

    if (!buyerId) {
      return res.status(400).send({
        message: req.translate("validation.required", {
          field: req.translate("user.buyerId"),
        }),
      });
    }

    // Cập nhật trạng thái và xóa token
    const buyer = await BuyerModel.findByIdAndUpdate(
      buyerId,
      { resetToken: null, tokenExpiration: null, status: userStatus.inactive },
      { new: true }
    );

    if (!buyer) {
      return res.status(404).send({
        message: req.translate("error.notFound", {
          field: req.translate("user.buyer"),
        }),
      });
    }

    res.status(200).send({
      message: req.translate("success.logout", {
        field: req.translate("user.buyer"),
      }),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: req.translate("error.server"),
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
        from: process.env.EMAIL_USER,
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

    console.log("Reset Token in DB:", user.resetToken);
    console.log("Reset Token from JWT:", resetToken);

    // Mã hóa mật khẩu mới
    const salt = bcrypt.genSaltSync(+process.env.SALT_ROUNDS);
    const hash = bcrypt.hashSync(password, salt);

    console.log("Old Hashed Password:", user.password); // Log mật khẩu cũ trước khi cập nhật
    console.log("New Hashed Password:", hash); // Log mật khẩu mới được hash

    // Cập nhật mật khẩu và xóa token
    user.set("password", hash); // Đảm bảo Mongoose theo dõi thay đổi
    user.resetToken = null;
    user.tokenExpiration = null;

    await user.save();

    // Lấy lại user từ database để kiểm tra mật khẩu đã được cập nhật
    const updatedUser = await BuyerModel.findById(user._id);
    console.log("Updated Password in DB:", updatedUser.password); // Log mật khẩu sau khi lưu

    res.status(200).send({ message: req.translate("user.passwordUpdated") });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(400).send({ message: error.message });
  }
};