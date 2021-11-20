import { Injectable } from '@nestjs/common';

import { Youtube } from '../entities/youtube.entity';

import * as puppeteer from 'puppeteer';

@Injectable()
export class YoutubeService {
  private youtubeContent: Youtube[] = [];

  async returnSearchedMusic(searchText: string) {
    const replaceNameSpace = searchText.replace('', '+');

    const videoLinkXpath = "//*[@id='video-title']";

    try {
      await (async () => {
        const browser = await puppeteer.launch();

        const page = await browser.newPage();

        await page.goto(
          `https://www.youtube.com/results?search_query=${replaceNameSpace}`,
        );

        const getVideoLinks = await page.$x(videoLinkXpath);

        const mapAllVideos = await Promise.all(
          getVideoLinks.map(async (videoLink) => {
            const links = await page.evaluate(
              (element) => element.href,
              videoLink,
            );

            return links;
          }),
        );

        await browser.close();

        this.youtubeContent.push(...mapAllVideos);
      })();
    } catch (err) {
      throw new Error(err);
    } finally {
      const shallowYoutubeContent = this.youtubeContent;

      this.youtubeContent = [];

      return {
        search: searchText,
        videos: shallowYoutubeContent,
      };
    }
  }
}
