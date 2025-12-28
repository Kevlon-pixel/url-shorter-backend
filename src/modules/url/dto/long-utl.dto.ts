import { ApiProperty } from '@nestjs/swagger';

export class OriginalUrl {
  @ApiProperty({
    example: 'https://music.youtube.com/',
    description: 'Полный адрес ресурса в интеренете.',
  })
  originalUrl: string;
}
