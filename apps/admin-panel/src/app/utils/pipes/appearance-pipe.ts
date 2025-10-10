import { Pipe, PipeTransform } from '@angular/core';
import { TuiAppearanceOptions } from '@taiga-ui/core';

import { StatusEnum } from '../../core/constants/status';

@Pipe({
  name: 'appearance',
  pure: true,
})
export class AppearancePipe implements PipeTransform {
  transform(value: string): TuiAppearanceOptions['appearance'] {
    switch (value) {
      case StatusEnum.ARCHIVED:
        return 'accent';
      case StatusEnum.DRAFT:
        return 'neutral';
      case StatusEnum.PUBLISHED:
        return 'positive';
      default:
        return 'neutral';
    }
  }
}
