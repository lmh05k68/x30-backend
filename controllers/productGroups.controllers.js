import {
  getProductGroupsByShopId,
  createProductGroup,
  getProductGroupById,
} from "../repositories/productGroups.repository.js";

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
  const shopId = req.shopId ?? "6734b6d71ea3b9c10ef6b5a7";
  const body = req.body;
  try {
    const newProductGroup = await createProductGroup({ ...body, shopId });
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
