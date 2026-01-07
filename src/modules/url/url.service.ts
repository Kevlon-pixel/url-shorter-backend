import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'prisma/prisma.service';
import * as crypto from 'crypto';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class UrlService {
  private SERVER_URL: string;

  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.SERVER_URL = configService.getOrThrow<string>('SERVER_URL');
  }

  async reduceUrl(originalUrl: string): Promise<{ url: string }> {
    const existing = await this.prismaService.url.findUnique({
      where: {
        originalUrl,
      },
    });
    if (existing) {
      return { url: this.SERVER_URL + '/' + existing.shortUrlId };
    }

    let shortUrlId = await this.generateShortUrlId();
    await this.prismaService.url.create({
      data: {
        originalUrl,
        shortUrlId,
      },
    });

    const shortUrl = this.SERVER_URL + '/' + shortUrlId;

    this.redisClient.zadd(
      'last_url',
      Date.now(),
      JSON.stringify({
        originalUrl,
        shortUrl,
      }),
    );

    await this.redisClient.zremrangebyrank('last_url', 0, -11);

    return { url: shortUrl };
  }

  async getUrlForRedirect(shortUrlId: string): Promise<string> {
    try {
      const url = await this.prismaService.url.findUniqueOrThrow({
        where: {
          shortUrlId,
        },
      });
      return url.originalUrl;
    } catch (err) {
      throw new NotFoundException('Ссылка не была найдена');
    }
  }

  async getLastRequests(): Promise<
    { originalUrl: string; shortUrl: string }[]
  > {
    const logs = await this.redisClient.zrevrange('last_url', 0, 10);
    return logs.map((entry) => JSON.parse(entry));
  }

  private async generateShortUrlId(): Promise<string> {
    for (let i = 0; i < 10; i++) {
      const shortUrlId = crypto.randomBytes(3).toString('hex');
      const existing = await this.prismaService.url.findUnique({
        where: {
          shortUrlId,
        },
      });
      if (!existing) {
        return shortUrlId;
      }
    }
    throw new InternalServerErrorException('Cannot generate unique shortUrlId');
  }
}
