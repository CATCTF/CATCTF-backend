import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { Logger } from '@nestjs/common';
import { sha256 } from './auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  if (config.get('NODE_ENV') !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('CATCTF API')
      .setDescription('For CATCTF')
      .setVersion('1.0')
      .addTag('REST')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('document', app, document);
  }

  app.use(cookieParser());
  app.enableCors({
    origin: config.get<string>(
      'CORS_ORIGIN',
      config.get<string>('CORS_ORIGIN'),
    ),
    methods: config.get<string>('CORS_METHODS', 'GET,PUT,POST,DELETE'),
    credentials: config.get<boolean>('CORS_CREDENTIALS', true),
    preflightContinue: config.get<boolean>('CORS_PREFLIGHT', false),
    optionsSuccessStatus: config.get<number>('CORS_OPTIONS_STATUS', 204),
  });

  if (config.get<string>('ADMIN_ID') && config.get<string>('ADMIN_PW')) {
    const userRepository = app.get('UserRepository');
    const adminUser = await userRepository.findOneBy({
      id: config.get<string>('ADMIN_ID'),
    });
    if (!adminUser) {
      await userRepository.save({
        id: config.get<string>('ADMIN_ID'),
        password: sha256(config.get<string>('ADMIN_PW')),
        name: config.get<string>('ADMIN_NAME', 'Admin'),
        email: config.get<string>('ADMIN_EMAIL', 'admin@catctf.com'),
        school: config.get<string>('ADMIN_SCHOOL', 'CATCTF'),
        rank: 0,
        isAdmin: true,
      });
      Logger.log('Admin user created.');
    }
    await app.listen(3000);
    Logger.log('Server is running on port 3000');
  } else Logger.error('Environment is not set. (ADMIN_ID or ADMIN_PW)');
}
bootstrap();
