import type { Repository } from "typeorm";
import type Category from "../entity/categories.js";
import { category } from "../enum/enum.js";
import createHttpError from "http-errors";
import type { IValidateQuery } from "../constant/index.js";

class CategoryService {
  constructor(private categoryRepository: Repository<Category>) {}

  async create(payload: category) {
    const exists = await this.categoryRepository.findOne({
      where: { name: payload },
    });

    if (exists) {
      throw createHttpError(409, "Category already exists");
    }

    return this.categoryRepository.save({ name: payload });
  }

  async list(search?: IValidateQuery) {
    const qb = this.categoryRepository
      .createQueryBuilder("category")
      .orderBy("category.id", "ASC");

    const term = search?.search?.trim();

    if (term) {
      qb.where("category.name ILIKE :q", { q: `%${term}%` });
    }

    const data = await qb.getMany();
    return data;
  }
}

export default CategoryService;
