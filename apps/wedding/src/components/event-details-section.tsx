import GoogleMapsLink from './google-maps-link';
import WhenSection from './when-section';
import WhereSection from './where-section';

interface EventDetailsSectionProps {
  readonly address: string;
  readonly date: string;
  readonly mapLabel: string;
  readonly mapUrl: string;
  readonly venueName: string;
  readonly whenLabel: string;
  readonly whereLabel: string;
}

export default function EventDetailsSection({
  address,
  date,
  mapLabel,
  mapUrl,
  venueName,
  whenLabel,
  whereLabel,
}: EventDetailsSectionProps) {
  return (
    <div className="py-25">
      <div className="container mx-auto text-center">
        <WhenSection label={whenLabel} date={date} />
        <WhereSection label={whereLabel} venueName={venueName} address={address} />
        <div className="mt-12">
          <GoogleMapsLink href={mapUrl} label={mapLabel} />
        </div>
      </div>
    </div>
  );
}

