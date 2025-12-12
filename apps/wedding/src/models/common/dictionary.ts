export interface Dictionary {
  aside: {
    coupleNames: string;
    weddingDate: string;
    weddingLocation: string;
  };
  common: Record<string, string>;
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
}
