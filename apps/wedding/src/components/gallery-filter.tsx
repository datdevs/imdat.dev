interface GalleryFilterProps {
  readonly activeFilter: string;
  readonly categories: Record<string, string>;
  readonly onFilterChange: (filter: string) => void;
  readonly viewAllLabel: string;
}

export default function GalleryFilter({ activeFilter, categories, onFilterChange, viewAllLabel }: GalleryFilterProps) {
  const filterKeys = Object.keys(categories);
  const allFilters = [...filterKeys, '*'];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, currentFilter: string) => {
    const currentIndex = allFilters.indexOf(currentFilter);
    let newIndex = currentIndex;

    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      newIndex = currentIndex > 0 ? currentIndex - 1 : allFilters.length - 1;
      onFilterChange(allFilters[newIndex]);
      (
        e.currentTarget.parentElement?.parentElement?.children[newIndex]?.querySelector('button') as HTMLElement
      )?.focus();
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      newIndex = currentIndex < allFilters.length - 1 ? currentIndex + 1 : 0;
      onFilterChange(allFilters[newIndex]);
      (
        e.currentTarget.parentElement?.parentElement?.children[newIndex]?.querySelector('button') as HTMLElement
      )?.focus();
    }
  };

  return (
    <ul aria-label="Gallery filters" className="flex flex-wrap gap-2">
      {Object.entries(categories).map(([key, label]) => (
        <li key={key}>
          <button
            aria-label={`Filter by ${label}`}
            aria-pressed={activeFilter === key}
            className={`focus-visible:ring-primary focus-visible:ring-2 focus-visible:outline-none ${
              activeFilter === key ? 'text-primary bg-white' : ''
            }`}
            data-filter={`.${key}`}
            onClick={() => onFilterChange(key)}
            onKeyDown={(e) => handleKeyDown(e, key)}
            type="button"
          >
            {label}
          </button>
        </li>
      ))}
      <li>
        <button
          aria-label={`Filter by ${viewAllLabel}`}
          aria-pressed={activeFilter === '*'}
          className={`focus-visible:ring-primary focus-visible:ring-2 focus-visible:outline-none ${
            activeFilter === '*' ? 'text-primary bg-white' : ''
          }`}
          onClick={() => onFilterChange('*')}
          onKeyDown={(e) => handleKeyDown(e, '*')}
          type="button"
        >
          {viewAllLabel}
        </button>
      </li>
    </ul>
  );
}
