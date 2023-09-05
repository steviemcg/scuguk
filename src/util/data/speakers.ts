import { SpeakerContent } from '@/content.types';
import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

const baseDir = './src/data/speakers';

export const getSpeaker = async (key: string): Promise<SpeakerContent> => {
  const yamlContent = await fs.promises.readFile(path.join(baseDir, `${key}.yml`), 'utf-8');

  return yaml.parse(yamlContent) as SpeakerContent;
};
