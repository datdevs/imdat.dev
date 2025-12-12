interface WhereSectionProps {
  readonly label: string;
  readonly venueName: string;
  readonly address: string;
}

export default function WhereSection({ label, venueName, address }: WhereSectionProps) {
  return (
    <div className="mt-12 space-y-4">
      <h4 className="font-serif text-2xl">{label}</h4>
      <h3 className="font-handwriting text-primary text-6xl">{venueName}</h3>
      <p className="font-serif text-base italic">{address}</p>
    </div>
  );
}

