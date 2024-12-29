import ProductGroupModel from "../models/ProductGroup.js";

export const getAllProductGroups = async (filter = {}) => {
  const query = {};
  if (filter.keyword) {
    query.$or = [
      { title: new RegExp(filter.keyword, "i") },
      { brand: new RegExp(filter.keyword, "i") },
    ];
  }
  const pageSize = filter.pageSize ?? 10;
  const page = filter.page ?? 1;
  const productGroups = await ProductGroupModel.find(query)
    .limit(pageSize)
    .skip((page - 1) * pageSize);
  const count = await ProductGroupModel.find(query).countDocuments();
  return { productGroups, count, page, pageSize };
};
export const getProductGroupById = (id) => ProductGroupModel.findById(id);

export const getProductGroupsByShopId = async (shopId, filter = {}) => {
  const query = {};
  query.shopId = shopId;
  if (filter.keyword) {
    query.$or = [
      { title: new RegExp(filter.keyword, "i") },
      { brand: new RegExp(filter.keyword, "i") },
    ];
  }
  const pageSize = filter.pageSize ?? 10;
  const page = filter.page ?? 1;
  const productGroups = await ProductGroupModel.find(query)
    .limit(pageSize)
    .skip((page - 1) * pageSize);
  const count = await ProductGroupModel.find(query).countDocuments();
  return { productGroups, count, page, pageSize };
};
export const getOneProductInProductGroup = (info) =>
  ProductGroupModel.findOne(info);
export const createProductGroup = (data) => ProductGroupModel.create(data);

export const findProductGroupByCategoryId = (info) => ProductGroupModel.find(info)
