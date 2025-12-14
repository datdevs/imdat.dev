'use client';

interface CountdownItemProps {
  readonly id: string;
  readonly label: string;
  readonly value: string;
}

export default function CountdownItem({ id, label, value }: CountdownItemProps) {
  return (
    <li className="flex items-start">
      <span className="text-6xl" id={id}>
        {value}
      </span>
      <span className="text-2xl">{label}</span>
    </li>
  );
}
