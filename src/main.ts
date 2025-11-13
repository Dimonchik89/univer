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


// !!!!!!!!!!!!!! ЗАПУСК МИГРАЦИИ ПОСЛЕ СТАРТА СЕРВЕРА И БД !!! ОБЯЗАТЕЛЬНО !!!!! npm run migration:run

// ngrok http 3000
