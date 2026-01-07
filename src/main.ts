import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cors from 'cors';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const client = process.env.CLIENT_URL || 'http://localhost:3000';
  app.use(cors({ origin: client, methods: ['GET', 'POST'] }));

  const logger = new Logger();

  const config = new DocumentBuilder()
    .setTitle('URL')
    .setDescription('URL description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const PORT = process.env.PORT ?? 3000;
  await app.listen(PORT, () => {
    logger.log(`Docs started at address: http://localhost:${PORT}/api`);
  });
}
bootstrap();
