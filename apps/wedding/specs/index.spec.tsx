import { render, screen } from '@testing-library/react';
import React from 'react';

import { fetchMedia } from '../src/api';
import Page from '../src/app/page';
import { Lang } from '../src/core/constant';
import { getDictionary } from '../src/utils';

// Mock dependencies
jest.mock('../src/api', () => ({
  fetchMedia: jest.fn(),
}));

jest.mock('../src/utils', () => ({
  getDictionary: jest.fn(),
}));

jest.mock('../src/components/aside', () => {
  return function MockAside() {
    return <aside data-testid="aside">Aside</aside>;
  };
});

jest.mock('../src/components/slider', () => {
  return function MockSlider({ slides }: { slides: string[] }) {
    return (
      <div data-testid="slider">
        {slides.map((slide) => (
          <img alt={`slide-${slide}`} key={slide} src={slide} />
        ))}
      </div>
    );
  };
});

const mockFetchMedia = fetchMedia as jest.MockedFunction<typeof fetchMedia>;
const mockGetDictionary = getDictionary as jest.MockedFunction<typeof getDictionary>;

describe('Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    mockGetDictionary.mockResolvedValue({
      common: {
        couple: 'Couple',
        event: 'Event',
        gallery: 'Gallery',
        home: 'Home',
        rsvp: 'RSVP',
        saveTheDay: 'Save the Day',
      },
    });

    mockFetchMedia.mockResolvedValue({
      data: {
        url: 'https://example.com/image.jpg',
      },
      success: true,
    });
  });

  it('should render successfully', async () => {
    const params = Promise.resolve({ lang: Lang.VI });
    const page = await Page({ params });
    const { container } = render(page);

    expect(container).toBeTruthy();
  });

  it('should display the couple names and wedding date', async () => {
    const params = Promise.resolve({ lang: Lang.VI });
    const page = await Page({ params });
    render(page);

    expect(screen.getByText('Ryan & Helen')).toBeTruthy();
    expect(screen.getByText('2 May, 2021 - Nha Trang')).toBeTruthy();
  });

  it('should render Aside component', async () => {
    const params = Promise.resolve({ lang: Lang.VI });
    const page = await Page({ params });
    render(page);

    expect(screen.getByTestId('aside')).toBeTruthy();
  });

  it('should render Slider with fetched slides', async () => {
    const params = Promise.resolve({ lang: Lang.VI });
    const page = await Page({ params });
    render(page);

    expect(screen.getByTestId('slider')).toBeTruthy();
    expect(mockFetchMedia).toHaveBeenCalled();
  });

  it('should handle English language parameter', async () => {
    const params = Promise.resolve({ lang: Lang.EN });
    const page = await Page({ params });
    render(page);

    expect(mockGetDictionary).toHaveBeenCalledWith(Lang.EN);
    expect(screen.getByText('Ryan & Helen')).toBeTruthy();
  });

  it('should default to Vietnamese when lang is not provided', async () => {
    const params = Promise.resolve({});
    const page = await Page({ params });
    render(page);

    expect(mockGetDictionary).toHaveBeenCalledWith(Lang.VI);
  });

  it('should handle media fetch errors gracefully', async () => {
    mockFetchMedia.mockRejectedValueOnce(new Error('Failed to fetch'));

    const params = Promise.resolve({ lang: Lang.VI });
    const page = await Page({ params });
    const { container } = render(page);

    // Component should still render even if some media fails
    expect(container).toBeTruthy();
    expect(screen.getByText('Ryan & Helen')).toBeTruthy();
  });
});
