import { TuiRoot } from "@taiga-ui/core";
import { Component, inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { MainComponent } from './layouts/main/main.component';

@Component({
  selector: 'app-admin',
  imports: [MainComponent, RouterModule, TuiRoot],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private matIconRegistry = inject(MatIconRegistry);

  constructor() {
    this.matIconRegistry.setDefaultFontSetClass('material-symbols-rounded');
  }
}
