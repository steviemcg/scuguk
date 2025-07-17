import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';
import { Dirent, promises as fs } from 'fs';
import fsSync from 'fs';
import handler from 'serve-handler';
import http from 'http';

const captureWidth = 1126;
const captureHeight = 569;
const clipY = 29;
const clipX = 40; // Accounts for container padding

const eventHtmlFolder = './out/events';
const eventsExportFolder = './public/events';
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

  const browserPath = process.env.CHROME_PATH || localChromePath;
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

  const files = await fs.readdir(eventHtmlFolder, { withFileTypes: true });
  const eventFiles = files.filter((f) => f.isFile() && f.name.endsWith('.html'));

  const tasks = eventFiles.map((file: Dirent) => async () => {
    const event = file.name.replace('.html', '');
    const filename = `${eventsExportFolder}/${event}-image.jpg`;

    if (fsSync.existsSync(filename)) {
      console.log('Skipping existing file ' + filename);
      return;
    }

    console.log('Loading event ' + event);

    const page = await browser.newPage();
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);

    const eventUrl = `http://localhost:3000/events/${event}/ad`;

    console.log('Navigating to ' + eventUrl);
    await page.goto(eventUrl, { waitUntil: 'networkidle0' });
    console.log('Navigated to ' + eventUrl);

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

    await fs.writeFile(filename, screenshot as Buffer, 'binary');

    console.log('Saved screenshot for ' + event);
    await page.close();
  });

  // Run tasks with concurrency control
  const runWithConcurrency = async (limit: number, tasks: (() => Promise<void>)[]) => {
    const active: Promise<void>[] = [];

    for (const task of tasks) {
      const p = task().then(() => {
        active.splice(active.indexOf(p), 1);
      });
      active.push(p);
      if (active.length >= limit) {
        await Promise.race(active);
      }
    }

    await Promise.all(active);
  };

  const concurrencyLimit = 1;
  await runWithConcurrency(concurrencyLimit, tasks);
  await browser.close();

  console.log('Closed browser');

  server.closeAllConnections();
  server.close();

  console.log('Stopped server');
};

generate();
