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



/**
 * @openapi
 * /api/category:
 *   post:
 *     summary: Create a category
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 description: Category name (must be one of allowed enum values)
 *                 example: "Food,Transport,Entertainment use this category only"
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Validation error
 */
categoryRouter.post(
  "/",
  categoryValidator, 
  (req: Request, res: Response, next: NextFunction) =>
    categoryController.create(req, res, next),
);


/**
 * @openapi
 * /api/category:
 *   get:
 *     summary: List categories
 *     tags: [Category]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           default: ""
 *         description: Optional search string for filtering categories
 *     responses:
 *       200:
 *         description: Categories fetched successfully
 *       400:
 *         description: Validation error
 */
categoryRouter.get(
  "/",
  catgeoyrSearch,
  (req: Request, res: Response, next: NextFunction) =>
    categoryController.list(req, res, next),
);

export default categoryRouter;
