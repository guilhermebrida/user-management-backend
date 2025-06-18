import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './user/user.entity'; 

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  synchronize: false,
  migrations: ['src/migrations/*.ts'],
  entities: [User],
});
