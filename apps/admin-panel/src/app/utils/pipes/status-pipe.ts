import { Pipe, PipeTransform } from '@angular/core';

import { StatusEnum } from '../../core/constants/status';

@Pipe({
  name: 'status',
  pure: true,
})
export class StatusPipe implements PipeTransform {
  transform(value: StatusEnum): string {
    switch (value) {
      case StatusEnum.ARCHIVED:
        return 'Archived';
      case StatusEnum.DRAFT:
        return 'Draft';
      case StatusEnum.PUBLISHED:
        return 'Published';
      default:
        return 'Unknown';
    }
  }
}
