import { EventAbstract, EventContent } from '@/content.types';
import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

const baseDir = './src/data/events';

/*
* This is inefficient but won't make much difference over a handful of events. This is probably
best replaced with a cache that reads all event data in once and then each of the functions just works 
with the few events in memory. */

export const getEventKeys = async (): Promise<string[]> => {
  const files = await fs.promises.readdir(baseDir);

  return files.filter((f) => f.endsWith('.yml')).map((file) => file.replace(/\.yml/, ''));
};

export const getUpcomingEvents = async (): Promise<EventAbstract[]> => {
  const eventKeys = await getEventKeys();
  const allEvents = await Promise.all(eventKeys.map(async (key) => await getEvent(key)));

  const today = new Date();
  return allEvents.filter((event) => event.date > today);
};

export const getEvents = async (): Promise<EventAbstract[]> => {
  const eventKeys = await getEventKeys();
  return await Promise.all(eventKeys.map(async (key) => await getEvent(key)));
};

export const getEvent = async (key: string): Promise<EventContent> => {
  const yamlContent = await fs.promises.readFile(path.join(baseDir, `${key}.yml`), 'utf-8');

  const event = { eventKey: key, ...yaml.parse(yamlContent) } as EventContent;

  // Reparse date so it gets parsed as GB time.
  event.date = new Date(
    Date.UTC(
      event.date.getUTCFullYear(),
      event.date.getUTCMonth(),
      event.date.getUTCDate(),
      event.date.getUTCHours(),
      event.date.getUTCMinutes()
    )
  );

  return event;
};
