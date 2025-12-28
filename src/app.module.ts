import { Module } from '@nestjs/common';

import { PrismaModule } from 'prisma/prisma.module';
import { UrlModule } from './modules/url/url.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    UrlModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
