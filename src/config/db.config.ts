import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import * as path from 'path';

export default (): PostgresConnectionOptions => ({
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: +process.env.DB_PORT,
  host: process.env.DB_HOST,
  type: 'postgres',
  synchronize: false, // только в режиме разработки, в режиме продашина нужно переключить на false
  entities: [path.resolve(__dirname, '..') + '/**/*.entity{.ts,.js}'],
});
