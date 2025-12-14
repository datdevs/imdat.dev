interface GalleryFilterProps {
  readonly activeFilter: string;
  readonly categories: Record<string, string>;
  readonly onFilterChange: (filter: string) => void;
  readonly viewAllLabel: string;
}

export default function GalleryFilter({ activeFilter, categories, onFilterChange, viewAllLabel }: GalleryFilterProps) {
  const handleFilterClick = (e: React.MouseEvent<HTMLButtonElement>, filter: string) => {
    e.preventDefault();
    onFilterChange(filter);
  };

  return (
    <ul className="gallery-menu mb-0 flex flex-wrap gap-2">
      {Object.entries(categories).map(([key, label]) => (
        <li key={key}>
          <button
            className={activeFilter === key ? 'active' : ''}
            data-filter={`.${key}`}
            onClick={(e) => handleFilterClick(e, key)}
            type="button"
          >
            {label}
          </button>
        </li>
      ))}
      <li>
        <button
          className={activeFilter === '*' ? 'active backlink' : 'backlink'}
          onClick={(e) => handleFilterClick(e, '*')}
          type="button"
        >
          {viewAllLabel}
        </button>
      </li>
    </ul>
  );
}
