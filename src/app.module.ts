import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { UrlModule } from './modules/url/url.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule, RedisModuleOptions } from '@nestjs-modules/ioredis';
import { AppController } from './app.controller';

@Module({
  imports: [
    PrismaModule,
    UrlModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const HOST = configService.getOrThrow<string>('REDIS_HOST');
        const PORT = configService.getOrThrow<string>('REDIS_PORT');

        const options: RedisModuleOptions = {
          type: 'single',
          url: `redis://${HOST}:${PORT}`,
        };

        return options;
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
