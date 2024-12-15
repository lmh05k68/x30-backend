import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";
import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
import ProductModel from "../models/Product.js";
import ProductGroupModel from "../models/ProductGroup.js";
dotenv.config()
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

import { findSellerByEmail, createSeller, findSeller, findSellerAndUpdate} from '../repositories/seller.repository.js'
import { createShop } from "../repositories/shop.repository.js";
import { userStatus } from "../const/user.const.js";
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
      if(user.status == userStatus.inactive) throw new Error(req.translate('user.banned'))
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
export {sellerLogin,sellerRegister, sellerProfile, sellerUpdateProfile,createProduct, getProducts, getProductById, updateProduct,createProductGroup, getProductGroups, getProductGroupById, updateProductGroup }