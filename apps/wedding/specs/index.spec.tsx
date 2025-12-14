import { render, screen } from '@testing-library/react';
import React from 'react';

import { fetchMedia } from '../src/api';
import Page from '../src/app/[lang]/page';
import { BRIDE, GROOM, Lang } from '../src/core/constant';
import { fetchMediaUrl, fetchMediaUrls, getDictionary, updatePersonWithMedia } from '../src/utils';

// Mock dependencies
jest.mock('../src/api', () => ({
  fetchMedia: jest.fn(),
}));

jest.mock('../src/utils', () => ({
  fetchMediaUrl: jest.fn(),
  fetchMediaUrls: jest.fn(),
  getDictionary: jest.fn(),
  updatePersonWithMedia: jest.fn(),
}));

jest.mock('../src/components/aside', () => {
  return function MockAside() {
    return <aside data-testid="aside">Aside</aside>;
  };
});

jest.mock('../src/components/hero-section', () => {
  return function MockHeroSection({ slides, subtitle, title }: { slides: string[]; subtitle: string; title: string }) {
    return (
      <section data-testid="hero-section">
        <h1>{title}</h1>
        <p>{subtitle}</p>
        <div data-testid="hero-slides">
          {slides.map((slide) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt={`slide-${slide}`} key={slide} src={slide} />
          ))}
        </div>
      </section>
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

jest.mock('../src/components/event-details-section', () => {
  return function MockEventDetailsSection({
    address,
    date,
    mapUrl,
    venueName,
  }: {
    address: string;
    date: string;
    mapUrl: string;
    venueName: string;
  }) {
    return (
      <section data-testid="event-details-section">
        <div data-testid="event-date">{date}</div>
        <div data-testid="event-venue">{venueName}</div>
        <div data-testid="event-address">{address}</div>
        <div data-testid="event-map-url">{mapUrl}</div>
      </section>
    );
  };
});

jest.mock('../src/components/countdown-section', () => {
  return function MockCountdownSection({ backgroundImage, title }: { backgroundImage: null | string; title: string }) {
    return (
      <section data-testid="countdown-section">
        <h2>{title}</h2>
        {backgroundImage && <div data-testid="countdown-background">{backgroundImage}</div>}
      </section>
    );
  };
});

jest.mock('next/image', () => {
  return function MockImage({ alt, src }: { alt: string; src: string }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} src={src} />;
  };
});

const mockFetchMedia = fetchMedia as jest.MockedFunction<typeof fetchMedia>;
const mockGetDictionary = getDictionary as jest.MockedFunction<typeof getDictionary>;
const mockFetchMediaUrl = fetchMediaUrl as jest.MockedFunction<typeof fetchMediaUrl>;
const mockFetchMediaUrls = fetchMediaUrls as jest.MockedFunction<typeof fetchMediaUrls>;
const mockUpdatePersonWithMedia = updatePersonWithMedia as jest.MockedFunction<typeof updatePersonWithMedia>;

describe('Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    mockGetDictionary.mockResolvedValue({
      aside: {
        coupleNames: 'Ryan & Helen',
        weddingDate: '02.05.2021',
        weddingLocation: 'Ryan & Helen wedding',
      },
      common: {
        couple: 'Couple',
        event: 'Event',
        gallery: 'Gallery',
        home: 'Home',
        rsvp: 'RSVP',
        saveTheDay: 'Save the Day',
      },
      countdown: {
        days: 'Days',
        hours: 'Hours',
        minutes: 'Minutes',
        reachedMessage: 'We got married! 🎉',
        seconds: 'Seconds',
        subReachedMessage: 'May 2, 2021',
        title: 'The Day We Become One',
      },
      couple: {
        bride: {
          description: 'Bride description',
          name: 'Helen',
        },
        groom: {
          description: 'Groom description',
          name: 'Ryan',
        },
      },
      event: {
        date: 'May 2, 2021',
        mapLabel: 'View Map',
        venueAddress: '18 Trần Phú, Lộc Thọ, Nha Trang',
        venueName: 'Yasaka Saigon Nha Trang Hotel',
        whenLabel: 'When?',
        whereLabel: 'Where?',
      },
      hero: {
        subtitle: '2 May, 2021 - Nha Trang',
        title: 'Ryan & Helen',
      },
    });

    mockFetchMedia.mockResolvedValue({
      data: {
        url: 'https://example.com/image.jpg',
      },
      success: true,
    });

    mockFetchMediaUrls.mockResolvedValue(['https://example.com/slide1.jpg', 'https://example.com/slide2.jpg']);
    mockFetchMediaUrl.mockResolvedValue('https://example.com/countdown-background.jpg');

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

  it('should render all main sections', async () => {
    const params = Promise.resolve({ lang: Lang.VI });
    const page = await Page({ params });
    render(page);

    expect(screen.getByTestId('aside')).toBeTruthy();
    expect(screen.getByTestId('hero-section')).toBeTruthy();
    expect(screen.getByTestId('couple-section')).toBeTruthy();
    expect(screen.getByTestId('event-details-section')).toBeTruthy();
    expect(screen.getByTestId('countdown-section')).toBeTruthy();
  });

  it('should display hero title and subtitle from dictionary', async () => {
    const params = Promise.resolve({ lang: Lang.VI });
    const page = await Page({ params });
    render(page);

    expect(screen.getByText('Ryan & Helen')).toBeTruthy();
    expect(screen.getByText('2 May, 2021 - Nha Trang')).toBeTruthy();
  });

  it('should render HeroSection with fetched slides', async () => {
    const params = Promise.resolve({ lang: Lang.VI });
    const page = await Page({ params });
    render(page);

    expect(screen.getByTestId('hero-section')).toBeTruthy();
    expect(screen.getByTestId('hero-slides')).toBeTruthy();
    expect(mockFetchMediaUrls).toHaveBeenCalled();
  });

  it('should render CoupleSection with bride and groom', async () => {
    const params = Promise.resolve({ lang: Lang.VI });
    const page = await Page({ params });
    render(page);

    expect(screen.getByTestId('couple-section')).toBeTruthy();
    expect(mockUpdatePersonWithMedia).toHaveBeenCalledWith(
      expect.objectContaining({
        ...BRIDE,
        description: expect.any(String),
        name: expect.any(String),
      }),
    );
    expect(mockUpdatePersonWithMedia).toHaveBeenCalledWith(
      expect.objectContaining({
        ...GROOM,
        description: expect.any(String),
        name: expect.any(String),
      }),
    );
  });

  it('should render EventDetailsSection with event data from dictionary', async () => {
    const params = Promise.resolve({ lang: Lang.VI });
    const page = await Page({ params });
    render(page);

    expect(screen.getByTestId('event-details-section')).toBeTruthy();
    expect(screen.getByTestId('event-date').textContent).toBe('May 2, 2021');
    expect(screen.getByTestId('event-venue').textContent).toBe('Yasaka Saigon Nha Trang Hotel');
  });

  it('should render CountdownSection with background image and labels', async () => {
    const params = Promise.resolve({ lang: Lang.VI });
    const page = await Page({ params });
    render(page);

    expect(screen.getByTestId('countdown-section')).toBeTruthy();
    expect(screen.getByText('The Day We Become One')).toBeTruthy();
    expect(screen.getByTestId('countdown-background').textContent).toBe('https://example.com/countdown-background.jpg');
    expect(mockFetchMediaUrl).toHaveBeenCalled();
  });

  it('should handle English language parameter', async () => {
    const params = Promise.resolve({ lang: Lang.EN });
    const page = await Page({ params });
    render(page);

    expect(mockGetDictionary).toHaveBeenCalledWith(Lang.EN);
    expect(screen.getByText('Ryan & Helen')).toBeTruthy();
  });

  it('should handle media fetch errors gracefully', async () => {
    // fetchMediaUrls returns empty array on errors (uses Promise.allSettled)
    mockFetchMediaUrls.mockResolvedValueOnce([]);
    // fetchMediaUrl returns null on errors (uses try-catch)
    mockFetchMediaUrl.mockResolvedValueOnce(null);
    // updatePersonWithMedia returns person with original src on errors (uses try-catch)
    mockUpdatePersonWithMedia.mockImplementation(async (person) => person);

    const params = Promise.resolve({ lang: Lang.VI });
    const page = await Page({ params });
    const { container } = render(page);

    // Component should still render even if some media fails
    expect(container).toBeTruthy();
    expect(screen.getByText('Ryan & Helen')).toBeTruthy();
    expect(screen.getByTestId('countdown-section')).toBeTruthy();
  });
});
