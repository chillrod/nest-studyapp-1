import { Module } from '@nestjs/common';

import { YoutubeController } from './controller/youtube.controller';
import { YoutubeService } from './service/youtube.service';

@Module({
  controllers: [YoutubeController],
  providers: [YoutubeService],
})
export class YoutubeModule {}
