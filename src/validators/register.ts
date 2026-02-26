import { body } from "express-validator";

export const registerValidator = [
  body("firstName")
    .notEmpty()
    .withMessage("First name is required"),

  body("lastName")
    .notEmpty()
    .withMessage("Last name is required"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .withMessage("Password must be at least 6 characters long"),

  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["admin", "user","read-only"])
    .withMessage("Role must be admin,user,read-only"),
];
