import { Status } from '../../models/common';

export enum StatusEnum {
  ARCHIVED = 'archived',
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

export const STATUS_OPTIONS: Status[] = [
  { id: StatusEnum.DRAFT, label: 'Draft', value: StatusEnum.DRAFT },
  { id: StatusEnum.PUBLISHED, label: 'Published', value: StatusEnum.PUBLISHED },
  { id: StatusEnum.ARCHIVED, label: 'Archived', value: StatusEnum.ARCHIVED },
];
