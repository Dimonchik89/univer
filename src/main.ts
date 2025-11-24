import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser())
  app.setGlobalPrefix('/api');
  app.enableCors({
    origin: [process.env.FRONTEND_URL, "http://192.168.0.106:3000", "https://db5285f2b66a.ngrok-free.app"],
    credentials: true,
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	allowedHeaders: 'Content-Type, Accept'
  });

  const config = new DocumentBuilder()
    .setTitle('«УНІВЕРСИТЕТ В СМАРТФОНІ» ДЛЯ ТДАТУ')
    .setDescription('Документація для роботи з API сервісу')
    .setVersion('1.0')
	// .addBearerAuth(
	// 	{ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    // 	'access_token',
	// )
    .addTag('ТДАТУ')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, documentFactory);

  await app.listen(process.env.PORT ?? 3005);
}
bootstrap();

// запускаем пустую базу данных

// удаляем папку dist

// удаляем старые миграции из папки migration в проектее

// Запускаем сервер и после создания папки dist останавливаем

// Запускаем базу данных

// в db.config.ts или db.config.production.ts меняем  synchronize: true,

// ------------- 1
// !!!!!!!!!!!!!! ЗАПУСК МИГРАЦИИ ПОСЛЕ СТАРТА  БД !!! ОБЯЗАТЕЛЬНО !!!!!
// npm run migration:generate -- src/migrations/InitialSchema

// в db.config.ts или db.config.production.ts меняем назад на synchronize: false,

// Запускаем сервер

// !!!!!!!!!!!!!! ЗАПУСК МИГРАЦИИ ПОСЛЕ СТАРТА  БД !!! ОБЯЗАТЕЛЬНО !!!!!
//  npm run migration:run

// ------------- 2
// !!!!!!!!!!!!!! ЗАПУСК МИГРАЦИИ ПОСЛЕ СТАРТА  БД !!! ОБЯЗАТЕЛЬНО !!!!!
// npx typeorm migration:create src/migrations/AddUserFullTextSearch и скопировать весь код из template.AddUserFullTextSearch.ts

// ------------- 3
// !!!!!!!!!!!!!! ЗАПУСК МИГРАЦИИ ПОСЛЕ СТАРТА  БД !!! ОБЯЗАТЕЛЬНО !!!!!
//  npm run migration:run

// ------------- 4
// !!!!!!!!!!!!!! ЗАПУСК SEED ПОСЛЕ СТАРТА  !!! ОБЯЗАТЕЛЬНО !!!!!
// npm run db:seed



// ngrok http 3000
