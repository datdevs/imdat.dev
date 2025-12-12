import type { Person } from '../models/common';

import PersonCard from './person-card';

interface CoupleSectionProps {
  readonly bride: Person;
  readonly groom: Person;
}

export default function CoupleSection({ bride, groom }: CoupleSectionProps) {
  return (
    <section className="bg-[#faf8f7] py-25">
      <div className="container mx-auto grid grid-cols-1 gap-6 md:grid-cols-2">
        <PersonCard person={groom} rtl />
        <PersonCard person={bride} />
      </div>
    </section>
  );
}
