import { Controller, Get, Query } from '@nestjs/common';

import { YoutubeService } from '../service/youtube.service';

@Controller()
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Get()
  returnSearchedMusic(@Query('searchText') searchText: string) {
    return this.youtubeService.returnSearchedMusic(searchText);
  }
}
