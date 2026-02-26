import { body } from "express-validator";
import { category } from "../enum/enum.js";

export const categoryValidator = [
  body("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isIn(Object.values(category))
    .withMessage(`Category must be one of: ${Object.values(category).join(", ")}`),
];