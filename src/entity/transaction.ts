import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { category } from "../enum/enum.js";
import { AuthUser } from "./user.js";


export type TransactionType = "income" | "expense";

@Entity({ name: "transactions" })
class Transaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => AuthUser, { nullable: false, onDelete: "CASCADE" })
  user!: AuthUser;

  @Column({ type: "enum", enum: ["income", "expense"] })
  type!: TransactionType;

  @Column({ type: "numeric", precision: 12, scale: 2 })
  amount!: number;

  @Column({ type: "enum", enum: category ,nullable: true  })
  category!: category | null;

  @Column({ type: "date" })
  transactionDate!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

export default Transaction;