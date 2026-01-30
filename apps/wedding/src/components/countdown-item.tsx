'use client';

interface CountdownItemProps {
  readonly id: string;
  readonly label: string;
  readonly value: string;
}

export default function CountdownItem({ id, label, value }: CountdownItemProps) {
  const labelId = `${id}-label`;
  return (
    <li className="flex items-start">
      <span aria-labelledby={labelId} className="text-6xl" id={id}>
        {value}
      </span>
      <span className="text-2xl" id={labelId}>
        {label}
      </span>
    </li>
  );
}
