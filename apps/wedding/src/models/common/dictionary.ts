export interface Dictionary {
  aside: {
    coupleNames: string;
    weddingDate: string;
    weddingLocation: string;
  };
  common: Record<string, string>;
  countdown: {
    days: string;
    hours: string;
    minutes: string;
    reachedMessage: string;
    seconds: string;
    subReachedMessage: string;
    title: string;
  };
  couple: {
    bride: {
      description: string;
      name: string;
    };
    groom: {
      description: string;
      name: string;
    };
  };
  event: {
    date: string;
    mapLabel: string;
    venueAddress: string;
    venueName: string;
    whenLabel: string;
    whereLabel: string;
  };
  hero: {
    subtitle: string;
    title: string;
  };
  notFound: {
    backToHome: string;
    description: string;
    message: string;
    title: string;
  };
}
