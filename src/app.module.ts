import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PushModule } from './push/push.module';
import { MessageModule } from './message/message.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { AcademicGroupModule } from './academic-group/academic-group.module';
import dbConfig from './config/db.config';
import dbConfigProduction from './config/db.config.production';
import { MailerModule } from '@nestjs-modules/mailer';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { EventModule } from './event/event.module';
import { ReminderModule } from './reminder/reminder.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [dbConfig, dbConfigProduction],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          port: configService.get<number>('MAIL_PORT'),
          secure: configService.get<boolean>('MAIL_SECURE'),
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
          tls: {
            // Отключает проверку сертификата (Использовать осторожно! Лучше использовать true)
            rejectUnauthorized: false,
          },
        },
        defaults: {
          from: configService.get<string>('MAIL_FROM'),
        },
      }),
    }),
    TypeOrmModule.forRootAsync({
      useFactory:
        process.env.NODE_ENV === 'production' ? dbConfigProduction : dbConfig,
    }),
    UserModule,
    PushModule,
    MessageModule,
    AuthModule,
    RoleModule,
    AcademicGroupModule,
	ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
	  serveRoot: "/static",
	  exclude: ['*'] // возможно убрать, протестить
    }),
	EventModule,
	ReminderModule,
	ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
