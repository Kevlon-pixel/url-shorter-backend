import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'prisma/prisma.service';
import { symbols, symblosLenght } from './data/symbols-array';

@Injectable()
export class UrlService {
  private MUL_CONST: number;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.MUL_CONST = configService.getOrThrow<number>('MUL_CONST');
  }

  async reduceUrl(originalUrl: string): Promise<string> {
    const url = await this.prismaService.url.findUnique({
      where: {
        originalUrl,
      },
    });
    if (url) {
      return url.shortUrlId;
    }

    let number = 0;
    for (let i = 0; i < originalUrl.length; i++) {
      number += originalUrl.charCodeAt(i) * this.MUL_CONST;
    }

    let shortUrlId: string = '';
    while (number) {
      const z = number % symblosLenght;

      shortUrlId += symbols[z];
      number = (number - z) / symblosLenght;
    }

    await this.prismaService.url.create({
      data: {
        originalUrl,
        shortUrlId,
      },
    });

    return shortUrlId;
  }

  async getUrlForRedirect(shortUrlId: string): Promise<string> {
    const url = await this.prismaService.url.findUniqueOrThrow({
      where: {
        shortUrlId,
      },
    });

    return url.originalUrl;
  }
}
