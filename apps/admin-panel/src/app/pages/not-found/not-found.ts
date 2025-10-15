import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  Signal,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { DotLottie } from '@lottiefiles/dotlottie-web';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiCard } from '@taiga-ui/layout';

@Component({
  selector: 'app-not-found',
  imports: [RouterModule, TuiCard, TuiIcon, TuiButton],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFound {
  protected readonly notFoundCanvas: Signal<ElementRef | undefined> = viewChild<ElementRef>('notFoundCanvas');
  private readonly destroyRef = inject(DestroyRef);

  private readonly dotLottie: WritableSignal<DotLottie | null> = signal<DotLottie | null>(null);

  constructor() {
    effect(() => {
      if (this.notFoundCanvas()) {
        this.dotLottie.set(
          new DotLottie({
            autoplay: true,
            canvas: this.notFoundCanvas()?.nativeElement,
            loop: true,
            src: '/images/404.lottie',
          }),
        );
      }
    });

    this.destroyRef.onDestroy(() => {
      this.dotLottie()?.destroy();
    });
  }
}
