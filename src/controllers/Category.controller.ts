import { type NextFunction, type Request, type Response } from "express";
import type CategoryService from "../services/Category.service.js";
import type { category } from "../enum/enum.js";
import { matchedData } from "express-validator";
import type { IValidateQuery } from "../constant/index.js";

class CategoryController {
  constructor(private categoryService: CategoryService) {}
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const create = await this.categoryService.create(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        req.body.name as category,
      );
      res.status(200).json({ msg: create });
    } catch (error) {
      next(error);
    }
  }

  list = async (req: Request, res: Response, next: NextFunction) => {
    const validateQuery: IValidateQuery = matchedData(req, {
      onlyValidData: true,
    });
    try {
     
      const data = await this.categoryService.list(validateQuery);
      res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  };
}
export default CategoryController;
