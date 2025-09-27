import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DotLottie } from '@lottiefiles/dotlottie-web';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiCard } from '@taiga-ui/layout';

@Component({
  selector: 'app-not-found',
  imports: [RouterModule, TuiCard, TuiIcon, TuiButton],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent implements AfterViewInit {
  @ViewChild('notFoundCanvas') notFoundCanvas!: ElementRef;

  dotLottie!: DotLottie;

  ngAfterViewInit() {
    this.dotLottie = new DotLottie({
      autoplay: true,
      canvas: this.notFoundCanvas.nativeElement,
      loop: true,
      src: '/images/animation-1724212391171.json',
    });
  }
}
