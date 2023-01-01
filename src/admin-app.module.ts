import { Module } from '@nestjs/common';
import { User } from './profile/user.entity';
import { Challenge } from './challenge/challenge.entity';
import { Solve } from './challenge/solve.entity';
import { File } from './challenge/file.entity';
import { AdminModule } from '@adminjs/nestjs';
import AdminJS from 'adminjs';
import { Database, Resource } from '@adminjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Notice } from './notice/notice.entity';

AdminJS.registerAdapter({ Database, Resource });

@Module({
  imports: [
    AdminModule.createAdminAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        adminJsOptions: {
          rootPath: '/admin',
          resources: [Notice, User, Challenge, Solve, File],
        },
        auth: {
          authenticate: async (email, password) => {
            const adminAccount = {
              email: config.get<string>('ADMIN_EMAIL'),
              password: config.get<string>('ADMIN_PW'),
            };
            if (
              email === adminAccount.email &&
              password === adminAccount.password
            ) {
              return Promise.resolve(adminAccount);
            }
            return null;
          },
          cookieName: config.get<string>('ADMIN_COOKIE_NAME'),
          cookiePassword: config.get<string>('ADMIN_COOKIE_PASSWORD'),
        },
        sessionOptions: {
          resave: true,
          saveUninitialized: true,
          secret: config.get<string>('ADMIN_SESSION_SECRET'),
        },
      }),
    }),
  ],
})
export class AdminAppModule {}
