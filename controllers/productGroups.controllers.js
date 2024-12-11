import { v2 as cloudinary } from "cloudinary";
import {
  getProductGroupsByShopId,
  createProductGroup,
  getProductGroupById,
  getAllProductGroups,
} from "../repositories/productGroups.repository.js";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

export const buyerGetProductGroups = async (req, res) => {
  const { keyword, page, pageSize } = req.query;
  try {
    const productGroups = await getAllProductGroups({keyword, page, pageSize});
    res.status(200).send({
      productGroups
    });
  } catch (error) {
    res.status(401).send({
      message: error.message,
    });
  }
};

export const buyerGetProductGroupById = async (req, res) => {
  const {productGroupId} = req.query
  try {
      const productGroup = await getProductGroupById({_id:productGroupId}).populate("productIds");
      if (!productGroup) throw new Error("Không tìm thấy sản phẩm")
      res.status(200).send({
          data: {
            productGroup,
          },
        });
    } catch (error) {
      res.status(404).send({
        message: error.message,
      });
    }
};

export const sellerGetProductGroups = async (req, res) => {
  const shopId = req.shopId ?? "6739fc3e79fe5e9ec53b3923";
  const { keyword, page, pageSize } = req.query;
  try {
    const data = await getProductGroupsByShopId( shopId, {keyword, page, pageSize});
    res.status(200).send({
      data
    });
  } catch (error) {
    res.status(401).send({
      message: error.message,
    });
  }
};


export const sellerGetProductGroupById = async (req, res) => {
    const shopId = req.shopId ?? '6739fc3e79fe5e9ec53b3923'
    const {productGroupId} = req.query
    try {
        const productGroup = await getProductGroupById({_id:productGroupId, shopId}).populate("productIds");
        if (!productGroup) throw new Error("Không tìm thấy sản phẩm")
        res.status(200).send({
            data: {
              productGroup,
            },
          });
      } catch (error) {
        res.status(404).send({
          message: error.message,
        });
      }
};

export const createNewProductGroup = async (req, res) => {
  const shopId = req.shopId;
  const {brand, description, title, categoryIds} = req.body;
  const file = req.file;
  try {
    // if (!file || !brand || !title || !description) {
    //   throw new Error('Products title, brand, description and image are required')}
    
    let urlImage;
    if(file) {
      const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString(
        "base64"
      )}`;
      const fileName = file.originalname.split(".")[0];
      await cloudinary.uploader.upload(
        dataUrl,
        {
          public_id: fileName,
          resource_type: "auto",
        },
        (err, result) => {
          if (err) throw new Error("upload file failed");
          if (result) {
            urlImage = result.secure_url;
            return urlImage;
          }
        }
      );
    }
    const newProductGroup = await createProductGroup({categoryIds, shopId, brand, description, title, image: urlImage});
    res.status(200).send({
      data: {
        newProductGroup,
      },
    });
  } catch (error) {
    res.status(401).send({
      message: error.message,
    });
  }
};

export const sellerAddProduct = async (req, res) => {
  const shopId = req.shopId
  const {productGroupId} = req.query
  const {productId} = req.body
  try {
      const productGroup = await getProductGroupById({_id:productGroupId, shopId})
      if (!productGroup) throw new Error("Không tìm thấy sản phẩm")
      productGroup.productIds.push(productId)
      await productGroup.save()
      res.status(201).send({
         message: "Thêm sản phẩm thành công"
        });
    } catch (error) {
      res.status(404).send({
        message: error.message,
      });
    }
};
