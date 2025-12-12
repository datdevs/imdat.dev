export interface Dictionary {
  common: Record<string, string>;
  hero: {
    title: string;
    subtitle: string;
  };
  aside: {
    coupleNames: string;
    weddingDate: string;
    weddingLocation: string;
  };
  event: {
    date: string;
    venueName: string;
    venueAddress: string;
    mapLabel: string;
    whenLabel: string;
    whereLabel: string;
  };
  couple: {
    bride: {
      name: string;
      description: string;
    };
    groom: {
      name: string;
      description: string;
    };
  };
}
