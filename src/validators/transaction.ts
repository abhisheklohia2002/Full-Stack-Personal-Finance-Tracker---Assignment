import { body } from "express-validator";
import { category } from "../enum/enum.js";

export const transactionValidator = [
  body("type")
    .notEmpty()
    .isIn(["income", "expense"])
    .withMessage("type must be income or expense"),

  body("amount")
    .notEmpty()
    .isFloat({ gt: 0 })
    .withMessage("amount must be greater than 0"),

  body("category")
    .notEmpty()
    .isIn(Object.values(category))
    .withMessage("invalid category"),

  body("transactionDate")
    .notEmpty()
    .isISO8601()
    .withMessage("transactionDate must be a valid date (YYYY-MM-DD)"),

     body("user")
    .notEmpty()
    .isFloat({ gt: 0 })
    .withMessage("userId required"),
];