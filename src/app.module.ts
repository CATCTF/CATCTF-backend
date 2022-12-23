import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DataBaseModule } from './database.module';
import { ProfileModule } from './profile/profile.module';
import { ChallengeModule } from './challenge/challenge.module';
import { ScoreModule } from './score/score.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env`],
    }),
    AuthModule,
    ProfileModule,
    DataBaseModule,
    ChallengeModule,
    ScoreModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
