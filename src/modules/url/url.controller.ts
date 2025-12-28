import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Redirect,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { ApiOperation } from '@nestjs/swagger';
import { OriginalUrl } from './dto/long-utl.dto';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @ApiOperation({ summary: 'Reduce original url.' })
  @Post()
  async reduceUrl(@Body() dto: OriginalUrl): Promise<string> {
    return await this.urlService.reduceUrl(dto.originalUrl);
  }

  @ApiOperation({ summary: 'Redirect from reduced url to original url.' })
  @Redirect('undefined', 301)
  @Get(':shortUrlId')
  async redirectByShortUrl(@Param('shortUrlId') shortUrlId: string) {
    const originalUrl = await this.urlService.getUrlForRedirect(shortUrlId);
    return { url: originalUrl };
  }
}
