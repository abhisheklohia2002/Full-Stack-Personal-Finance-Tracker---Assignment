import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { category } from "../enum/enum.js";

@Entity({ name: "categories" })
class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "enum",
    enum: category,
    unique: true,
  })
  name: category;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

export default Category;
