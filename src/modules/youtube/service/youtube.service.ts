import { Injectable } from '@nestjs/common';

import { Youtube } from '../entities/youtube.entity';

import * as puppeteer from 'puppeteer';

@Injectable()
export class YoutubeService {
  private youtubeContent: Youtube[] = [];

  async returnSearchedMusic(searchText: string) {
    const replaceNameSpace = searchText.replace('', '+');

    const videoLinkXpath = "//*[@id='video-title']";
    const videoImageXPath =
      '//*[@id="dismissible"]/ytd-thumbnail/a/yt-img-shadow/img';

    try {
      await (async () => {
        const browser = await puppeteer.launch();

        const page = await browser.newPage();

        await page.goto(
          `https://www.youtube.com/results?search_query=${replaceNameSpace}`,
        );

        const getVideoLinks = await page.$x(videoLinkXpath);
        const videoImages = await page.$x(videoImageXPath);

        const mapAllVideos = await Promise.all(
          getVideoLinks.map(async (videoLink) => {
            const links: string = await page.evaluate(
              (element) => element.href,
              videoLink,
            );

            const title: string = await page.evaluate(
              (element) => element.textContent,
              videoLink,
            );

            return {
              videoLink: links,
              videoTitle: title,
            };
          }),
        );

        const mapAllImages = await Promise.all(
          videoImages.map(async (videoImage) => {
            const image: string = await page.evaluate(
              (element) => element.src,
              videoImage,
            );

            return {
              image,
            };
          }),
        );
        console.log(
          '🚀 ~ file: youtube.service.ts ~ line 62 ~ YoutubeService ~ await ~ mapAllImages',
          { mapAllImages },
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
        searchText,
        videos: shallowYoutubeContent,
      };
    }
  }
}
