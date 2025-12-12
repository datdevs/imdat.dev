import type { Person } from '../../models/common';

import { IMAGE } from './image';

export const BRIDE: Person = {
  description:
    'Hôm nay em sẽ là cô dâu đẹp nhất, hạnh phúc nhất. Em mong chúng ta sẽ mãi mãi hạnh phúc như thế này anh nhé.',
  image: {
    alt: 'bride',
    height: 140,
    src: IMAGE.couple.bride,
    width: 140,
  },
  name: 'Diệu Trang',
  socialLinks: [
    { platform: 'facebook', url: 'https://www.facebook.com' },
    { platform: 'instagram', url: 'https://www.instagram.com' },
  ],
};

export const GROOM: Person = {
  description:
    'Không ai hoàn hảo cả nhưng chúng ta có thể bù đắp cho nhau, tình yêu là phải biết hy sinh và nhường nhịn lẫn nhau mới sống tốt.',
  image: {
    alt: 'groom',
    height: 140,
    src: IMAGE.couple.groom,
    width: 140,
  },
  name: 'Chí Đạt',
  socialLinks: [
    { platform: 'facebook', url: 'https://www.facebook.com' },
    { platform: 'instagram', url: 'https://www.instagram.com' },
  ],
};
