import { SponsorContent } from '@/content.types';
import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

const baseDir = './src/data/sponsors';

export const getSponsorContent = async (): Promise<SponsorContent[]> => {
  const files = await fs.promises.readdir(baseDir);

  return Promise.all(
    files
      .filter((f) => f.endsWith('.yml'))
      .map(async (file) => {
        const yamlContent = await fs.promises.readFile(path.join(baseDir, file), 'utf-8');

        return { ...(yaml.parse(yamlContent) as SponsorContent), key: file.slice(0, -4) };
      })
  );
};

export const getSponsor = async (key: string): Promise<SponsorContent> => {
  const yamlContent = await fs.promises.readFile(path.join(baseDir, `${key}.yml`), 'utf-8');

  return { ...(yaml.parse(yamlContent) as SponsorContent), key };
};
