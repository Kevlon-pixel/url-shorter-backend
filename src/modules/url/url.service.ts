import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class UrlService {
  private SERVER_URL: string;

  constructor(
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

    return { url: this.SERVER_URL + '/' + shortUrlId };
  }

  async getUrlForRedirect(shortUrlId: string): Promise<string> {
    const url = await this.prismaService.url.findUniqueOrThrow({
      where: {
        shortUrlId,
      },
    });

    return url.originalUrl;
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
