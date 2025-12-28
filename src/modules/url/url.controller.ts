import { Body, Controller, Post, Res } from '@nestjs/common';
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
}
