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
import { DotLottie } from '@lottiefiles/dotlottie-web';

@Component({
  selector: 'app-empty',
  templateUrl: './empty.html',
  styleUrl: './empty.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Empty {
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
            src: '/images/not-found.lottie',
          }),
        );
      }
    });

    this.destroyRef.onDestroy(() => {
      this.dotLottie()?.destroy();
    });
  }
}
