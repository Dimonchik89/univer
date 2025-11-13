import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import dbConfig from './config/db.config';
import dbConfigProduction from './config/db.config.production';

const isProduction = process.env.NODE_ENV === 'production';
let configFunction = isProduction ? {...dbConfig()} : {...dbConfigProduction()};



const dataSource = new DataSource({
	...configFunction,
	migrations: ["dist/migrations/*.js"]
})

export default dataSource;