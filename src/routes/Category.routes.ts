import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import CategoryController from "../controllers/Category.controller.js";
import CategoryService from "../services/Category.service.js";
import { AppDataSource } from "../config/data-source.js";
import Category from "../entity/categories.js";
import catgeoyrSearch from "../validators/catgeoyrSearch.js";
import { categoryValidator } from "../validators/category.js";

const categoryRouter = express.Router();
const categoryRepository = AppDataSource.getRepository(Category);

const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

categoryRouter.post(
  "/",
  categoryValidator, 
  (req: Request, res: Response, next: NextFunction) =>
    categoryController.create(req, res, next),
);

categoryRouter.get(
  "/",
  catgeoyrSearch,
  (req: Request, res: Response, next: NextFunction) =>
    categoryController.list(req, res, next),
);

export default categoryRouter;
