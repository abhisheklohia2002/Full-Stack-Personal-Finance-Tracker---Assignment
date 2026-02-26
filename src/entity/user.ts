import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "../enum/enum.js";

@Entity({ name: "authUser" })
export class AuthUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 200 })
  firstName: string;

  @Column({ type: "varchar", length: 200 })
  lastName: string;

  @Column({ type: "varchar", length: 200, unique: true })
  email: string;

  @Column({ type: "varchar", length: 255, select: false })
  password: string;

  @Column({ type: "varchar", enum: UserRole })
  role: string;
}