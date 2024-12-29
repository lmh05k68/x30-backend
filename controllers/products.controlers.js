import { v2 as cloudinary } from "cloudinary";
import {
  createProduct,
  getAllProducts,
  getOneProduct,
  getProductsByShopId,
} from "../repositories/products.repository.js";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

export const getProducts = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.status(200).send({
      data: {
        products,
      },
    });
  } catch (error) {
    res.status(401).send({
      message: error.message,
    });
  }
};

export const sellerGetProducts = async (req, res) => {
  const shopId = req.shopId ?? "6739fc3e79fe5e9ec53b3923";
  const { keyword } = req.query;
  try {
    if (keyword) {
      let regex = new RegExp(keyword, "i");
      const filteredProducts = await getProductsByShopId({ name: regex });
      res.status(200).send({
        data: {
          filteredProducts,
        },
      });
      return
    }
    const products = await getProductsByShopId({ shopId });
    res.status(200).send({
      data: {
        products,
      },
    });
  } catch (error) {
    res.status(401).send({
      message: error.message,
    });
  }
};

export const sellerGetOneProduct = async (req, res) => {
  const shopId = req.shopId;
  const { productId } = req.params;

  try {
    const product = await getOneProduct({ shopId, _id: productId });
    res.status(200).send({
      data: {
        product,
      },
    });
  } catch (error) {
    res.status(401).send({
      message: error.message,
    });
  }
};

export const sellerCreateProduct = async (req, res) => {
  const shopId = req.shopId;
  const {name, importedQuantity, pricePerUnit, price, properties} = req.body
  const file = req.file;
  try {
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
    const product = await createProduct({ 
      shopId,
      name, 
      importedQuantity, 
      pricePerUnit, 
      price, 
      properties,
      image: urlImage
     });
      
    res.status(201).send({
      data: {
        product,
      },
    });
  } catch (error) {
    res.status(401).send({
      message: error.message,
    });
  }
};

export const sellerUpdateProduct = async (req, res) => {
  const shopId = req.shopId;
  const { productId } = req.params;
  const {importedQuantity, pricePerUnit, price} = req.body
  const file = req.file;
  try {
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
    const product = await getOneProduct({ shopId, _id: productId });
        product.importedQuantity = importedQuantity ? importedQuantity : product.importedQuantity
        product.pricePerUnit = pricePerUnit ? pricePerUnit : product.pricePerUnit
        product.totalImportedPrice = importedQuantity && pricePerUnit ? +importedQuantity * +pricePerUnit : product.totalImportedPrice
        product.price = price ? price : product.price
        product.image = file ? urlImage : product.image
        product.inStock = importedQuantity ? +importedQuantity + +product.inStock : product.inStock

        await product.save()
      
    res.status(201).send({
      data: {
        product,
      },
    });
  } catch (error) {
    res.status(401).send({
      message: error.message,
    });
  }
};


