'use cache';

import 'server-only';

import { Lang } from '../core/constant';
import { Dictionary } from '../models/common';

const dictionaries: Record<Lang, () => Promise<Dictionary>> = {
  [Lang.EN]: () => import('../dictionaries/en.json').then((module) => module.default),
  [Lang.VI]: () => import('../dictionaries/vi.json').then((module) => module.default),
};

export const getDictionary = async (locale: Lang): Promise<Dictionary> => dictionaries[locale]();
