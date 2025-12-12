interface WhenSectionProps {
  readonly date: string;
  readonly label: string;
}

export default function WhenSection({ date, label }: WhenSectionProps) {
  return (
    <div className="space-y-4">
      <h4 className="font-serif text-2xl">{label}</h4>
      <h3 className="font-handwriting text-primary text-6xl">{date}</h3>
    </div>
  );
}
