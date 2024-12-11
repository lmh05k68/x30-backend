import Joi from "joi";
import { getValidationError } from "../utils/joi.utils.js";
export const buyerValidateRegisterRequest = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string()
      .alphanum()
      .min(3)
      .max(255)
      .required()
      .messages({
        "any.required": req.translate("validation.required", {
          field: req.translate("user.fullName"),
        }),
        "string.empty": req.translate("validation.required", {
            field: req.translate("user.fullName"),
          }),
      }),
    email: Joi.string()
      .email(new RegExp("/^w+@[a-zA-Z_]+?.[a-zA-Z]{2,3}$/"))
      .required()
      .messages({
        "any.required": req.translate("validation.required", {
          field: req.translate("user.email"),
        }),
        "string.empty": req.translate("validation.required", {
            field: req.translate("user.email"),
          }),
      }),
    phoneNumber: Joi.string()
      .required()
      .messages({
        "any.required": req.translate("validation.required", {
          field: req.translate("user.phone"),
        }),
        "string.empty": req.translate("validation.required", {
            field: req.translate("user.phone"),
          }),
      }),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required()
      .messages({
        "any.required": req.translate("validation.required", {
          field: req.translate("user.password"),
        }),
        "string.empty": req.translate("validation.required", {
            field: req.translate("user.password"),
          }),
      }),
  }).options({
    abortEarly: false,
  });
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    res.status(400).send(getValidationError(error));
  }
};
export const buyerValidateLoginRequest = async (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string()
        .email()
        .required()
        .messages({
          "any.required": req.translate("validation.required", {
            field: req.translate("user.email"),
          }),
          "string.empty": req.translate("validation.required", {
            field: req.translate("user.email"),
          }),
        }),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required()
        .messages({
          "any.required": req.translate("validation.required", {
            field: req.translate("user.password"),
          }),
          "string.empty": req.translate("validation.required", {
            field: req.translate("user.email"),
          }),
        }),
    }).options({
      abortEarly: false,
    });
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (error) {
      res.status(400).send(getValidationError(error));
    }
  };
  export const validateUpdateBuyerRequest = async (req, res, next) => {
    const schema = Joi.object({
      fullName: Joi.string()
        .required()
        .max(255)
        .messages({
          "any.required": req.translate("validation.required", {
            field: req.translate("user.fullName"),
          }),
          "string.max": req.translate("validation.maxLength", {
            field: req.translate("user.fullName"),
            value: 255
          }),
        }),
      avatar: Joi.string()
        .required()
        .max(1000)
        .messages({
          "any.required": req.translate("validation.required", {
            field: req.translate("user.avatar"),
          }),
          "string.max": req.translate("validation.maxLength", {
            field: req.translate("user.fullName"),
            value: 1000
          }),
        }),
    }).options({
      abortEarly: false,
    });
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (error) {
      res.status(400).send(getValidationError(error));
    }
  };

//   export const buyerValidateUpdateAvatarRequest = async (req, res, next) => {
//     const schema = Joi.object({
//       mimetype: Joi.string()
//       .required()
//       .valid("image/jpeg","image/png", "image/svg+xml", "image/tiff", "image/jpg")
//       .messages({
//         "any.required": req.translate("validation.required", {
//           field: req.translate("user.avatar"),
//         }),
//         "any.valid": req.translate("validation.file.image", {
//           field: req.translate("user.avatar")
//         }),
//       }),
//     }).options({
//       abortEarly: false,
//     });
//     try {
//       const file = req.file
//       const mimetype = file?.mimetype
//       await schema.validateAsync({mimetype});
//       next();
//     } catch (error) {
//       res.status(400).send(getValidationError(error));
//     }
// };