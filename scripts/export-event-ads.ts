import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';
import { Dirent, promises as fs } from 'fs';
import handler from 'serve-handler';
import http from 'http';

const captureWidth = 1126;
const captureHeight = 569;
const clipY = 29;
const clipX = 40; // Accounts for container padding

const eventsExportFolder = './out/events';
const localChromePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\Chrome.exe';

const server = http.createServer((request, response) => {
  // You pass two more arguments for config and middleware
  // More details here: https://github.com/vercel/serve-handler#options
  return handler(request, response, { public: 'out' });
});

const generate = async () => {
  server.listen(3000, () => {
    console.log('Started server on http://localhost:3000');
  });

  const browserPath = process.env.CHROME_PATH ? process.env.CHROME_PATH : localChromePath;
  console.log('Loading browser from ' + browserPath);

  const browser = await puppeteer.launch({
    executablePath: browserPath,
    args: chromium.args,
    defaultViewport: {
      width: 1200,
      height: captureHeight + clipY,
    },
    headless: true,
  });

  console.log('Loaded browser');

  const files = await fs.readdir(eventsExportFolder, { withFileTypes: true });
  const eventFiles = files.filter((f) => f.isFile() && f.name.endsWith('.html'));

  await Promise.all(
    eventFiles.map(async (file: Dirent) => {
      const event = file.name.replace('.html', '');

      console.log('Loading event ' + event);

      const page = await browser.newPage();
      await page.emulateMediaFeatures([
        // no need for any animations to be going
        { name: 'prefers-reduced-motion', value: 'reduce' },
      ]);

      await page.goto(`http://localhost:3000/events/${event}/ad`, { waitUntil: 'networkidle0' });

      const screenshot = await page.screenshot({
        type: 'jpeg',
        quality: 90,
        clip: {
          x: clipX,
          y: clipY,
          width: captureWidth,
          height: captureHeight,
        },
      });

      await fs.writeFile(`${eventsExportFolder}/${event}-image.jpg`, screenshot as Buffer, 'binary');

      console.log('Saved screenshot for ' + event);

      page.close();
      return true;
    })
  );

  await browser.close();

  console.log('Closed browser');

  server.closeAllConnections();
  server.close();

  console.log('Stopped server');
};

generate();
