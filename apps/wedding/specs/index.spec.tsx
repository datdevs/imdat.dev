import { render, screen } from '@testing-library/react';
import React from 'react';

import { fetchMedia } from '../src/api';
import Page from '../src/app/page';
import { BRIDE, GROOM, Lang } from '../src/core/constant';
import { fetchMediaUrls, getDictionary, updatePersonWithMedia } from '../src/utils';

// Mock dependencies
jest.mock('../src/api', () => ({
  fetchMedia: jest.fn(),
}));

jest.mock('../src/utils', () => ({
  fetchMediaUrls: jest.fn(),
  getDictionary: jest.fn(),
  updatePersonWithMedia: jest.fn(),
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

jest.mock('../src/components/couple-section', () => {
  return function MockCoupleSection({ bride, groom }: { bride: unknown; groom: unknown }) {
    return (
      <section data-testid="couple-section">
        <div data-testid="bride">{JSON.stringify(bride)}</div>
        <div data-testid="groom">{JSON.stringify(groom)}</div>
      </section>
    );
  };
});

jest.mock('next/image', () => {
  return function MockImage({ alt, src }: { alt: string; src: string }) {
    return <img alt={alt} src={src} />;
  };
});

const mockFetchMedia = fetchMedia as jest.MockedFunction<typeof fetchMedia>;
const mockGetDictionary = getDictionary as jest.MockedFunction<typeof getDictionary>;
const mockFetchMediaUrls = fetchMediaUrls as jest.MockedFunction<typeof fetchMediaUrls>;
const mockUpdatePersonWithMedia = updatePersonWithMedia as jest.MockedFunction<typeof updatePersonWithMedia>;

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

    mockFetchMediaUrls.mockResolvedValue(['https://example.com/slide1.jpg', 'https://example.com/slide2.jpg']);

    mockUpdatePersonWithMedia.mockImplementation(async (person) => ({
      ...person,
      image: {
        ...person.image,
        src: 'https://example.com/updated-image.jpg',
      },
    }));
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
    expect(mockFetchMediaUrls).toHaveBeenCalled();
  });

  it('should render CoupleSection with bride and groom', async () => {
    const params = Promise.resolve({ lang: Lang.VI });
    const page = await Page({ params });
    render(page);

    expect(screen.getByTestId('couple-section')).toBeTruthy();
    expect(mockUpdatePersonWithMedia).toHaveBeenCalledWith(BRIDE);
    expect(mockUpdatePersonWithMedia).toHaveBeenCalledWith(GROOM);
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
    // fetchMediaUrls returns empty array on errors (uses Promise.allSettled)
    mockFetchMediaUrls.mockResolvedValueOnce([]);
    // updatePersonWithMedia returns person with original src on errors (uses try-catch)
    mockUpdatePersonWithMedia.mockImplementation(async (person) => person);

    const params = Promise.resolve({ lang: Lang.VI });
    const page = await Page({ params });
    const { container } = render(page);

    // Component should still render even if some media fails
    expect(container).toBeTruthy();
    expect(screen.getByText('Ryan & Helen')).toBeTruthy();
  });
});
