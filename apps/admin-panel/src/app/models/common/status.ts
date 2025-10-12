export interface Status<T> {
  disabled?: boolean;
  icon?: string;
  id: number | string;
  label: string;
  value: T;
}
