import jwt from "jsonwebtoken"
import nodemailer from 'nodemailer';
import bcrypt from "bcrypt";
import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
import ProductModel from "../models/Product.js";
import ProductGroupModel from "../models/ProductGroup.js";
import crypto from 'crypto'
dotenv.config()
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});
import SellerModel from '../models/Seller.js'
import { findSellerByEmail, createSeller, findSeller, findSellerAndUpdate} from '../repositories/seller.repository.js'
import { createShop } from "../repositories/shop.repository.js";
import { userStatus } from "../const/user.const.js";
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
//người mua đăng kí
const sellerRegister = async (req, res) => {
    const { name, email, password, phone } = req.body;
    try {
      const checkUser = await findSellerByEmail(email);
      if (checkUser) throw new Error(req.translate('user.emailExisted'));
      const newShop = await createShop({name, phones: [phone], img: "https://dummyimage.com/200x200/f57070/fff.png&text=hello+world", addresses: [],  businessLicense: "", taxCode: "", citizenId: "", description: "", status: userStatus.active})
      const salt = bcrypt.genSaltSync(+process.env.SALT_ROUNDS);
      const hash = bcrypt.hashSync(password, salt);
      const newUser = await createSeller({
        name,
        email,
        password: hash,
        phone,
        shopId: newShop._id
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
export const sellerLogin = async (req, res) => {
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
    const seller = await SellerModel.findOne({ email });

    if (!seller) {
      return res.status(404).send({
        message: req.translate("error.notFound", {
          field: req.translate("user.buyer"),
        }),
      });
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, seller.password);
    if (!isPasswordValid) {
      return res.status(401).send({
        message: req.translate("error.invalidCredentials"),
      });
    }

    // Tạo token đăng nhập
    const token = jwt.sign({ id: buyer._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Cập nhật trạng thái và lưu token
    await SellerModel.findByIdAndUpdate(seller._id, {
      resetToken: token,
      tokenExpiration: Date.now() + 3600000, // 1 giờ
      status: userStatus.active,
    });

    res.status(200).send({
      message: req.translate("success.login"),
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: req.translate("error.server"),
    });
  }
};
//log out 
export const logoutSeller = async (req, res) => {
  try {
    const { sellerId } = req.body; // Lấy sellerId từ body request

    if (!sellerId) {
      return res.status(400).send({
        message: req.translate("validation.required", {
          field: req.translate("user.sellerId"),
        }),
      });
    }

    // Cập nhật trạng thái và xóa token
    const seller = await SellerModel.findByIdAndUpdate(
      sellerId,
      { resetToken: null, tokenExpiration: null, status: userStatus.inactive },
      { new: true }
    );

    if (!seller) {
      return res.status(404).send({
        message: req.translate("error.notFound", {
          field: req.translate("user.seller"),
        }),
      });
    }

    res.status(200).send({
      message: req.translate("success.logout", {
        field: req.translate("user.seller"),
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

// Thêm sản phẩm mới
const createProduct = async (req, res) => {
  const { name, price, inStock, properties, image, discount, pricePerUnit, importedQuantity } = req.body;
  const shopId = req.currentUser.shopId; // Lấy shopId từ người bán hiện tại

  try {
      const newProduct = await ProductModel.create({
          name,
          price,
          inStock,
          properties,
          image,
          discount,
          pricePerUnit,
          importedQuantity,
          shopId
      });

      res.status(201).send({
          message: "Product created successfully",
          product: newProduct
      });
  } catch (error) {
      res.status(400).send({
          message: error.message
      });
  }
};
// Lấy danh sách toàn bộ sản phẩm của người bán
const getProducts = async (req, res) => {
  const shopId = req.currentUser.shopId; // Lấy shopId từ người bán hiện tại

  try {
      const products = await ProductModel.find({ shopId });
      res.status(200).send({
          products
      });
  } catch (error) {
      res.status(400).send({
          message: error.message
      });
  }
};
// Lấy thông tin chi tiết một sản phẩm
const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
      const product = await ProductModel.findById(id);
      if (!product) throw new Error("Product not found");

      res.status(200).send({
          product
      });
  } catch (error) {
      res.status(404).send({
          message: error.message
      });
  }
};
// Cập nhật sản phẩm
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
      const updatedProduct = await ProductModel.findByIdAndUpdate(id, updates, { new: true });
      if (!updatedProduct) throw new Error("Product not found");

      res.status(200).send({
          message: "Product updated successfully",
          product: updatedProduct
      });
  } catch (error) {
      res.status(400).send({
          message: error.message
      });
  }
};
// Thêm product group mới
const createProductGroup = async (req, res) => {
  const { averageRate, brand, description, image, title, productIds, categoryIds } = req.body;
  const shopId = req.currentUser.shopId; // Lấy shopId từ người bán hiện tại

  try {
      const newProductGroup = await ProductGroupModel.create({
          averageRate,
          brand,
          description,
          image,
          title,
          shopId,
          productIds,
          categoryIds
      });

      res.status(201).send({
          message: "Product group created successfully",
          productGroup: newProductGroup
      });
  } catch (error) {
      res.status(400).send({
          message: error.message
      });
  }
};
// Lấy danh sách toàn bộ product groups của người bán
const getProductGroups = async (req, res) => {
  const shopId = req.currentUser.shopId; // Lấy shopId từ người bán hiện tại

  try {
      const productGroups = await ProductGroupModel.find({ shopId });
      res.status(200).send({
          productGroups
      });
  } catch (error) {
      res.status(400).send({
          message: error.message
      });
  }
};
// Lấy thông tin chi tiết một product group
const getProductGroupById = async (req, res) => {
  const { id } = req.params;

  try {
      const productGroup = await ProductGroupModel.findById(id);
      if (!productGroup) throw new Error("Product group not found");

      res.status(200).send({
          productGroup
      });
  } catch (error) {
      res.status(404).send({
          message: error.message
      });
  }
};
// Cập nhật một product group
const updateProductGroup = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
      const updatedProductGroup = await ProductGroupModel.findByIdAndUpdate(id, updates, { new: true });
      if (!updatedProductGroup) throw new Error("Product group not found");

      res.status(200).send({
          message: "Product group updated successfully",
          productGroup: updatedProductGroup
      });
  } catch (error) {
      res.status(400).send({
          message: error.message
      });
  }
};
export const sellerForgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await SellerModel.findOne({ email });
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
//seller reset password
export const sellerResetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.RESET_TK_KEY);
    const { resetToken, email } = decoded;

    const user = await SellerModel.findOne({ email, resetToken });
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
    const updatedUser = await SellerModel.findById(user._id);
    console.log("Updated Password in DB:", updatedUser.password); // Log mật khẩu sau khi lưu

    res.status(200).send({ message: req.translate("user.passwordUpdated") });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(400).send({ message: error.message });
  }
};
export {sellerRegister, sellerProfile, sellerUpdateProfile,createProduct, getProducts, getProductById, updateProduct,createProductGroup, getProductGroups, getProductGroupById, updateProductGroup }