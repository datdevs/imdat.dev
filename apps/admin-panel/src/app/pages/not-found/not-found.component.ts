import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { DotLottie } from '@lottiefiles/dotlottie-web';

@Component({
  selector: 'app-not-found',
  imports: [RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
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
