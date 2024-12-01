import {
  getAllProducts,
  getOneProduct,
  getProductsByShopId,
} from "../repositories/products.repository.js";

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
  const shopId = req.shopId ?? "6739fc3e79fe5e9ec53b3923";
  const { productId } = req.params;

  try {
    const product = await getOneProduct({ shopId, _id: productId });
    console.log({ shopId, _id: productId });
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
