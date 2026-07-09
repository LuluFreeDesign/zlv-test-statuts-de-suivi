import * as path from 'node:path';

import async from 'async';
import sharp, { type Color, type OutputInfo } from 'sharp';

import statusColors from '../components/Map/status-colors';

const SIZE = 15;
const BORDER_SIZE = 1;

interface CreateImageOptions {
  border: Color;
  background: Color;
  filename: string;
}

const directory = path.join(import.meta.dirname, '..', '..', 'public', 'map');

async function createImage(options: CreateImageOptions): Promise<OutputInfo> {
  return sharp({
    create: {
      channels: 3,
      background: options.background,
      width: SIZE,
      height: SIZE
    }
  })
    .extend({
      top: BORDER_SIZE,
      right: BORDER_SIZE,
      bottom: BORDER_SIZE,
      left: BORDER_SIZE,
      background: options.border
    })
    .png()
    .toFile(path.join(directory, options.filename));
}

// One coloured square per status (index 0..5 → square-fill-0..5.png). Status 0
// (Aucune action) is included in statusColors now, so no separate default here.
async.forEachOf(
  statusColors.borderColors,
  async ([status, borderColor], index) => {
    const [, backgroundColor] = statusColors.backgroundColors[index as number];
    return createImage({
      border: borderColor,
      background: backgroundColor,
      filename: `square-fill-${status}.png`
    });
  }
);
