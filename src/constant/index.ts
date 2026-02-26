import { type Request } from "express";
import type { category } from "../enum/enum.js";

export interface IAuthUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface ICateory {
  name: string;
}

export interface IValidateQuery {
  search: string;
}

export interface IAuthRequest extends Request {
  auth?: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    sub: string;
  };
}


export type TransactionType = "income" | "expense";

export interface ICreateTransaction {
  type: TransactionType;
  amount: number;
  category: category;
  transactionDate: string;
  user:number;
}


export interface ITransactionQuery {
  search?: string;
  type?: "income" | "expense";
  category?: category;
  from?: string;
  to?: string;
  page?: string;
  limit?: string;
}

export interface ICategoryBreakdown{
    category:category,
    total:number
}
export interface ITrend{
  month:string;
  income:number;
  expense:number
}