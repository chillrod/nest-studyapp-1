import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { YoutubeModule } from './modules/youtube/youtube.module';

async function bootstrap() {
  const app = await NestFactory.create(YoutubeModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
