import { Controller, Get } from '@nestjs/common';

@Controller('test')
export class AppController {
  @Get('ping')
  ping() {
    return 'pong';
  }
}
